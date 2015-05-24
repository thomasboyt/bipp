/* global AudioContext */

import { Store } from 'flummox';

class AudioStore extends Store {
  constructor(flux) {
    super(flux);

    const audioActions = flux.getActionIds('audio');

    this.register(audioActions.loadAudio, this.handleLoadAudio);

    this.state = {
      audioData: null,
      ctx: new AudioContext()
    };
  }

  getLength() {
    return this.state.audioData.duration;
  }

  handleLoadAudio(audioData) {
    this.state.ctx.decodeAudioData(audioData, (data) => {
      this.setState({
        audioData: data
      });
    });
  }
}

export default AudioStore;
