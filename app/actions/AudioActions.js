import {Actions} from 'flummox';

class EditorActions extends Actions {
  loadAudio(audioData) {
    return {audioData};
  }
}

export default EditorActions;
