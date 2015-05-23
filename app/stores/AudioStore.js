/* global AudioContext */

import { Store } from 'flummox';

class AudioStore extends Store {
  constructor(flux) {
    super(flux);

    const actionIds = flux.getActionIds('audio');

    this.register(actionIds.loadAudio, this.handleLoadAudio);

    this.state = {
      audioData: null,
      ctx: new AudioContext()
    };
  }

  getLength() {
    const buf = this.state.audioData;

    if (!buf) {
      return null;
    }

    return buf.duration;
  }

  handleLoadAudio({audioData}) {
    this.state.ctx.decodeAudioData(audioData, (data) => {
      this.setState({
        audioData: data
      });
    });
  }
}

export default AudioStore;
