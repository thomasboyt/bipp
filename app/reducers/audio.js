import createImmutableReducer from '../util/immutableReducer';
import { Record } from 'immutable';

import {
  LOAD_AUDIO,
} from '../ActionTypes';

const State = Record({
  audioData: null,
});

const initialState = new State({
  audioData: null,
});


const audioReducer = createImmutableReducer(initialState, {
  [LOAD_AUDIO]: function({audioData}, state) {
    return state.set('audioData', audioData);
  },
});

export default audioReducer;
