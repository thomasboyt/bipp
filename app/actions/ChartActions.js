import {
  LOAD_SONG,
  TOGGLE_NOTE,
  CHANGE_BPM,
} from '../ActionTypes';

export function loadSong(song, difficulty) {
  return {
    type: LOAD_SONG,
    song: song,
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
