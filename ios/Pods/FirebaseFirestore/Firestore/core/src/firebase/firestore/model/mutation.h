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

#ifndef FIRESTORE_CORE_SRC_FIREBASE_FIRESTORE_MODEL_MUTATION_H_
#define FIRESTORE_CORE_SRC_FIREBASE_FIRESTORE_MODEL_MUTATION_H_

#include <memory>

#include "Firestore/core/src/firebase/firestore/model/document_key.h"
#include "Firestore/core/src/firebase/firestore/model/field_mask.h"
#include "Firestore/core/src/firebase/firestore/model/field_value.h"
#include "Firestore/core/src/firebase/firestore/model/maybe_document.h"
#include "Firestore/core/src/firebase/firestore/model/precondition.h"
#include "Firestore/core/src/firebase/firestore/model/snapshot_version.h"

namespace firebase {
namespace firestore {
namespace model {

/**
 * Represents a Mutation of a document. Different subclasses of Mutation will
 * perform different kinds of changes to a base document. For example, a
 * SetMutation replaces the value of a document and a DeleteMutation deletes a
 * document.
 *
 * In addition to the value of the document mutations also operate on the
 * version. For local mutations (mutations that haven't been committed yet), we
 * preserve the existing version for Set, Patch, and Transform mutations. For
 * local deletes, we reset the version to 0.
 *
 * Here's the expected transition table.
 *
 * MUTATION           APPLIED TO      RESULTS IN
 * SetMutation        Document(v3)    Document(v3)
 * SetMutation        NoDocument(v3)  Document(v0)
 * SetMutation        null            Document(v0)
 * PatchMutation      Document(v3)    Document(v3)
 * PatchMutation      NoDocument(v3)  NoDocument(v3)
 * PatchMutation      null            null
 * TransformMutation  Document(v3)    Document(v3)
 * TransformMutation  NoDocument(v3)  NoDocument(v3)
 * TransformMutation  null            null
 * DeleteMutation     Document(v3)    NoDocument(v0)
 * DeleteMutation     NoDocument(v3)  NoDocument(v0)
 * DeleteMutation     null            NoDocument(v0)
 *
 * For acknowledged mutations, we use the updateTime of the WriteResponse as the
 * resulting version for Set, Patch, and Transform mutations. As deletes have no
 * explicit update time, we use the commitTime of the WriteResponse for
 * acknowledged deletes.
 *
 * If a mutation is acknowledged by the backend but fails the precondition check
 * locally, we return an `UnknownDocument` and rely on Watch to send us the
 * updated version.
 *
 * Note that TransformMutations don't create Documents (in the case of being
 * applied to a NoDocument), even though they would on the backend. This is
 * because the client always combines the TransformMutation with a SetMutation
 * or PatchMutation and we only want to apply the transform if the prior
 * mutation resulted in a Document (always true for a SetMutation, but not
 * necessarily for an PatchMutation).
 */
class Mutation {
 public:
  virtual ~Mutation() {
  }

  const DocumentKey& key() const {
    return key_;
  }
  const Precondition& precondition() const {
    return precondition_;
  }

  // TODO(rsgowman): ApplyToRemoteDocument()

  /**
   * Applies this mutation to the given MaybeDocument for the purposes of
   * computing the new local view of a document. Both the input and returned
   * documents can be nullptr.
   *
   * @param maybe_doc The document to mutate. The input document can be nullptr
   *     if the client has no knowledge of the pre-mutation state of the
   *     document.
   * @param base_doc The state of the document prior to this mutation batch. The
   *     input document can be nullptr if the client has no knowledge of the
   *     pre-mutation state of the document.
   * @param local_write_time A timestamp indicating the local write time of the
   *     batch this mutation is a part of.
   * @return The mutated document. The returned document may be nullptr, but
   *     only if maybe_doc was nullptr and the mutation would not create a new
   *     document.
   */
  virtual std::shared_ptr<const MaybeDocument> ApplyToLocalView(
      const std::shared_ptr<const MaybeDocument>& maybe_doc,
      const MaybeDocument* base_doc,
      const Timestamp& local_write_time) const = 0;

 protected:
  Mutation(DocumentKey&& key, Precondition&& precondition);

  void VerifyKeyMatches(const MaybeDocument* maybe_doc) const;

  static SnapshotVersion GetPostMutationVersion(const MaybeDocument* maybe_doc);

 private:
  const DocumentKey key_;
  const Precondition precondition_;
};

/**
 * A mutation that creates or replaces the document at the given key with the
 * object value contents.
 */
class SetMutation : public Mutation {
 public:
  SetMutation(DocumentKey&& key,
              FieldValue&& value,
              Precondition&& precondition);

  // TODO(rsgowman): ApplyToRemoteDocument()

  std::shared_ptr<const MaybeDocument> ApplyToLocalView(
      const std::shared_ptr<const MaybeDocument>& maybe_doc,
      const MaybeDocument* base_doc,
      const Timestamp& local_write_time) const override;

 private:
  const FieldValue value_;
};

/**
 * A mutation that modifies fields of the document at the given key with the
 * given values. The values are applied through a field mask:
 *
 * - When a field is in both the mask and the values, the corresponding field is
 *   updated.
 * - When a field is in neither the mask nor the values, the corresponding field
 *   is unmodified.
 * - When a field is in the mask but not in the values, the corresponding field
 *   is deleted.
 * - When a field is not in the mask but is in the values, the values map is
 *   ignored.
 */
class PatchMutation : public Mutation {
 public:
  PatchMutation(DocumentKey&& key,
                FieldValue&& value,
                FieldMask&& mask,
                Precondition&& precondition);

  // TODO(rsgowman): ApplyToRemoteDocument()

  std::shared_ptr<const MaybeDocument> ApplyToLocalView(
      const std::shared_ptr<const MaybeDocument>& maybe_doc,
      const MaybeDocument* base_doc,
      const Timestamp& local_write_time) const override;

 private:
  FieldValue PatchDocument(const MaybeDocument* maybe_doc) const;
  FieldValue PatchObject(FieldValue obj) const;

  const FieldValue value_;
  const FieldMask mask_;
};

}  // namespace model
}  // namespace firestore
}  // namespace firebase

#endif  // FIRESTORE_CORE_SRC_FIREBASE_FIRESTORE_MODEL_MUTATION_H_
