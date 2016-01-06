import {LOAD_SONGS} from '../ActionTypes';

export function loadSongs(songs) {
  return {
    type: LOAD_SONGS,
    songs
  }
}
