import audioCtx from '../audioContext';

import {
  LOAD_AUDIO,
} from '../ActionTypes';

import songs from '../config/songs';

export function loadAudio(songIdx) {
  return async function(dispatch) {
    const url = songs[songIdx].musicUrl;
    const resp = await window.fetch(url);
    const data = await resp.arrayBuffer();

    audioCtx.decodeAudioData(data, (audioData) => {
      dispatch({
        type: LOAD_AUDIO,
        audioData,
      });
    });
  };
}
