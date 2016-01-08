/*
 * This reducer holds a map of song slugs to their loaded audio data.
 */

import createImmutableReducer from '../util/immutableReducer';
import I from 'immutable';

import {
  LOAD_AUDIO,
} from '../ActionTypes';

export const AudioState = I.Record({
  audioData: I.Map(),
});

const initialState = new AudioState();

const audioReducer = createImmutableReducer(initialState, {
  [LOAD_AUDIO]: function({audioData, song}, state) {
    return state.setIn(['audioData', song.slug], audioData);
  },
});

export default audioReducer;
