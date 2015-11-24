import createImmutableReducer from '../util/immutableReducer';
import { Record } from 'immutable';

import {
  RESET_PLAYBACK,
  ENTER_PLAYBACK,
  EXIT_PLAYBACK,
  PLAY_NOTE,
  SET_RATE,
} from '../ActionTypes';

const State = new Record({
  notes: null,
  bpm: null,

  inPlayback: false,
  playbackOffset: null,

  startTime: null,
  initialOffsetTime: null,
  msPerOffset: null,
  judgement: null,

  playbackRate: 1
});

const initialState = new State();


const judgements = [
  [21.5, 'Fantastic'],
  [43, 'Excellent'],
  [102, 'Great'],
  [135, 'Decent'],
  [180, 'Way Off']
];

const missedJudgement = 'Miss';

const maxJudgementThreshold = judgements[4][0];

const judgementFor = function(diff) {
  return `${diff.toFixed(2)}`;

  // const absDiff = Math.abs(diff);
  // const label = judgements.filter((j) => absDiff < j[0])[0][1];
  //
  // - : you hit the note before it was supposed to be played (too early)
  // + : you hit the note after it was supposed to be played (too late)
  // const sign = diff < 0 ? '-' : '+';

  // return `${label} ${sign}`;
};

const playbackReducer = createImmutableReducer(initialState, {
  [RESET_PLAYBACK]: function(action, state) {
  },

  [ENTER_PLAYBACK]: function({offset, bpm, notes}, state) {
  },

  [EXIT_PLAYBACK]: function(action, state) {
  },

  [PLAY_NOTE]: function({time, column}, state) {
  },

  [SET_RATE]: function({rate}, state) {
  },
});

export default playbackReducer;
