import {
  LOAD_SONG,
  TOGGLE_NOTE,
  CHANGE_BPM,
} from '../ActionTypes';

const songs = require('../config/songs');

export function loadSong(idx, difficulty) {
  return {
    type: LOAD_SONG,
    song: songs[idx],
    difficulty,
  };
}

export function toggleNote(offset, column) {
  return {
    type: TOGGLE_NOTE,
    offset,
    column,
  };
}

export function changeBPM(bpm) {
  return {
    type: CHANGE_BPM,
    bpm,
  };
}
