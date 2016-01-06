import createImmutableReducer from '../util/immutableReducer';
import I from 'immutable';

import {
  LOAD_AUDIO,
} from '../ActionTypes';

const State = I.Record({
  audioData: I.Map(),
});

const initialState = new State();


const audioReducer = createImmutableReducer(initialState, {
  [LOAD_AUDIO]: function({audioData, song}, state) {
    return state.setIn(['audioData', song.slug], audioData);
  },
});

export default audioReducer;
