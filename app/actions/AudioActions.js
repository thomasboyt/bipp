import {Actions} from 'flummox';

const songs = require('../config/songs');

class AudioActions extends Actions {
  async loadAudio(songIdx) {
    const url = songs[songIdx].musicUrl;
    const resp = await window.fetch(url);
    const data = await resp.arrayBuffer();
    return data;
  }
}

export default AudioActions;
