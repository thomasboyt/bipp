import audioCtx from '../audioContext';

import {
  LOAD_AUDIO,
} from '../ActionTypes';

export function loadAudio(song) {
  // TODO: this should really have some kind of error handling
  return async function(dispatch) {
    const url = song.musicUrl;
    const resp = await window.fetch(url);
    const data = await resp.arrayBuffer();

    audioCtx.decodeAudioData(data, (audioData) => {
      dispatch({
        type: LOAD_AUDIO,
        song,
        audioData,
      });
    });
  };
}
