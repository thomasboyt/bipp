import {Actions} from 'flummox';

const songs = require('../config/songs');

class SongActions extends Actions {
  loadSong(idx, difficulty) {
    return {song: songs[idx], difficulty: difficulty};
  }

  toggleNote(offset, column) {
    return {offset, column};
  }

  changeBPM(bpm) {
    return bpm;
  }
}

export default SongActions;
