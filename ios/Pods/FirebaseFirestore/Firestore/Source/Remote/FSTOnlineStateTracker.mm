/*
 * Copyright 2018 Google
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#import "Firestore/Source/Remote/FSTOnlineStateTracker.h"

#include <chrono>  // NOLINT(build/c++11)

#import "Firestore/Source/Remote/FSTRemoteStore.h"

#include "Firestore/core/src/firebase/firestore/util/executor.h"
#include "Firestore/core/src/firebase/firestore/util/hard_assert.h"
#include "Firestore/core/src/firebase/firestore/util/log.h"

namespace chr = std::chrono;
using firebase::firestore::model::OnlineState;
using firebase::firestore::util::AsyncQueue;
using firebase::firestore::util::DelayedOperation;
using firebase::firestore::util::TimerId;

NS_ASSUME_NONNULL_BEGIN

namespace {

// To deal with transient failures, we allow multiple stream attempts before giving up and
// transitioning from OnlineState Unknown to Offline.
// TODO(mikelehen): This used to be set to 2 as a mitigation for b/66228394. @jdimond thinks that
// bug is sufficiently fixed so that we can set this back to 1. If that works okay, we could
// potentially remove this logic entirely.
const int kMaxWatchStreamFailures = 1;

// To deal with stream attempts that don't succeed or fail in a timely manner, we have a
// timeout for OnlineState to reach Online or Offline. If the timeout is reached, we transition
// to Offline rather than waiting indefinitely.
const AsyncQueue::Milliseconds kOnlineStateTimeout = chr::seconds(10);

}  // namespace

@interface FSTOnlineStateTracker ()

/** The current OnlineState. */
@property(nonatomic, assign) OnlineState state;

/**
 * A count of consecutive failures to open the stream. If it reaches the maximum defined by
 * kMaxWatchStreamFailures, we'll revert to OnlineState::Offline.
 */
@property(nonatomic, assign) int watchStreamFailures;

/**
 * Whether the client should log a warning message if it fails to connect to the backend
 * (initially YES, cleared after a successful stream, or if we've logged the message already).
 */
@property(nonatomic, assign) BOOL shouldWarnClientIsOffline;

@end

@implementation FSTOnlineStateTracker {
  /**
   * A timer that elapses after kOnlineStateTimeout, at which point we transition from OnlineState
   * Unknown to Offline without waiting for the stream to actually fail (kMaxWatchStreamFailures
   * times).
   */
  DelayedOperation _onlineStateTimer;

  /** The worker queue to use for running timers (and to call onlineStateDelegate). */
  AsyncQueue *_workerQueue;
}

- (instancetype)initWithWorkerQueue:(AsyncQueue *)workerQueue {
  if (self = [super init]) {
    _workerQueue = workerQueue;
    _state = OnlineState::Unknown;
    _shouldWarnClientIsOffline = YES;
  }
  return self;
}

- (void)handleWatchStreamStart {
  if (self.watchStreamFailures == 0) {
    [self setAndBroadcastState:OnlineState::Unknown];

    HARD_ASSERT(!_onlineStateTimer, "_onlineStateTimer shouldn't be started yet");
    _onlineStateTimer =
        _workerQueue->EnqueueAfterDelay(kOnlineStateTimeout, TimerId::OnlineStateTimeout, [self] {
          _onlineStateTimer = {};
          HARD_ASSERT(self.state == OnlineState::Unknown,
                      "Timer should be canceled if we transitioned to a different state.");
          [self logClientOfflineWarningIfNecessaryWithReason:
                    [NSString stringWithFormat:@"Backend didn't respond within %lld seconds.",
                                               chr::duration_cast<chr::seconds>(kOnlineStateTimeout)
                                                   .count()]];
          [self setAndBroadcastState:OnlineState::Offline];

          // NOTE: handleWatchStreamFailure will continue to increment
          // watchStreamFailures even though we are already marked Offline but this is
          // non-harmful.
        });
  }
}

- (void)handleWatchStreamFailure:(NSError *)error {
  if (self.state == OnlineState::Online) {
    [self setAndBroadcastState:OnlineState::Unknown];

    // To get to OnlineState::Online, updateState: must have been called which would have reset
    // our heuristics.
    HARD_ASSERT(self.watchStreamFailures == 0, "watchStreamFailures must be 0");
    HARD_ASSERT(!_onlineStateTimer, "_onlineStateTimer must not be set yet");
  } else {
    self.watchStreamFailures++;
    if (self.watchStreamFailures >= kMaxWatchStreamFailures) {
      [self clearOnlineStateTimer];
      [self logClientOfflineWarningIfNecessaryWithReason:
                [NSString stringWithFormat:@"Connection failed %d times. Most recent error: %@",
                                           kMaxWatchStreamFailures, error]];
      [self setAndBroadcastState:OnlineState::Offline];
    }
  }
}

- (void)updateState:(OnlineState)newState {
  [self clearOnlineStateTimer];
  self.watchStreamFailures = 0;

  if (newState == OnlineState::Online) {
    // We've connected to watch at least once. Don't warn the developer about being offline going
    // forward.
    self.shouldWarnClientIsOffline = NO;
  }

  [self setAndBroadcastState:newState];
}

- (void)setAndBroadcastState:(OnlineState)newState {
  if (newState != self.state) {
    self.state = newState;
    [self.onlineStateDelegate applyChangedOnlineState:newState];
  }
}

- (void)logClientOfflineWarningIfNecessaryWithReason:(NSString *)reason {
  NSString *message = [NSString
      stringWithFormat:
          @"Could not reach Cloud Firestore backend. %@\n This typically indicates that your "
          @"device does not have a healthy Internet connection at the moment. The client will "
          @"operate in offline mode until it is able to successfully connect to the backend.",
          reason];
  if (self.shouldWarnClientIsOffline) {
    LOG_WARN("%s", message);
    self.shouldWarnClientIsOffline = NO;
  } else {
    LOG_DEBUG("%s", message);
  }
}

- (void)clearOnlineStateTimer {
  _onlineStateTimer.Cancel();
}

@end

NS_ASSUME_NONNULL_END
