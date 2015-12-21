import { combineReducers } from 'redux';

import audio from './audio';
import chart from './chart';
import playback from './playback';
import fps from './fps';

const rootReducer = combineReducers({
  audio,
  chart,
  playback,
  fps,
});

export default rootReducer;
