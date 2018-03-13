import React, { Component } from 'react';
import { TalkWithSpeaker } from './TalkWithSpeaker';
import { TalkWithoutSpeaker } from './TalkWithoutSpeaker';
import { styles } from './styles';

export class TalkListItem extends Component {

    render = () => {
      const { navigation, talk, client } = this.props;
      return talk.speaker 
        ? <TalkWithSpeaker talk={talk} speaker={talk.speaker} navigation={navigation} client={client} />
        : <TalkWithoutSpeaker talk={talk} />
    };
}
