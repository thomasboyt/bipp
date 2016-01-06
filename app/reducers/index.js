import { combineReducers } from 'redux';

import audio from './audio';
import chart from './chart';
import playback from './playback';
import fps from './fps';
import songs from './songs';

const rootReducer = combineReducers({
  audio,
  chart,
  playback,
  fps,
  songs,
});

export default rootReducer;
