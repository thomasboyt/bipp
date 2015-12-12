import {
  RESET_PLAYBACK,
  ENTER_PLAYBACK,
  EXIT_PLAYBACK,
  PLAY_NOTE,
  SET_RATE,
} from '../ActionTypes';

export function enterPlayback(offset, bpm, notes, beatSpacing) {
  return {
    type: ENTER_PLAYBACK,
    offset,
    bpm,
    notes,
    beatSpacing,
  };
}

export function exitPlayback() {
  return {
    type: EXIT_PLAYBACK,
  };
}

export function resetPlayback() {
  return {
    type: RESET_PLAYBACK,
  };
}

export function playNote(time, column) {
  return {
    type: PLAY_NOTE,
    time,
    column
  };
}

export function updateRate(rate) {
  return {
    type: SET_RATE,
    rate
  };
}
