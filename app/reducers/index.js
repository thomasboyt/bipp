import { combineReducers } from 'redux';

import audio from './audio';
import chart from './chart';
import playback from './playback';

const rootReducer = combineReducers({
  audio,
  chart,
  playback,
});

export default rootReducer;
