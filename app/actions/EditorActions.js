import {Actions} from 'flummox';

const songs = require('../config/songs');

class EditorActions extends Actions {
  loadSong(idx) {
    return songs[idx];
  }

  toggleNote(offset, column) {
    return {offset, column};
  }

  changeBPM(bpm) {
    return bpm;
  }
}

export default EditorActions;
