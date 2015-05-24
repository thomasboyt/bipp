import {Actions} from 'flummox';

class AudioActions extends Actions {
  loadAudio(audioData) {
    return {audioData};
  }
}

export default AudioActions;
