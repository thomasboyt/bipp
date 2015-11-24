import createImmutableReducer from '../util/immutableReducer';
import { Record } from 'immutable';

import {
  RESET_PLAYBACK,
  ENTER_PLAYBACK,
  EXIT_PLAYBACK,
  PLAY_NOTE,
  SET_RATE,
  PLAYBACK_TICK,
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

function getMsPerOffset(bpm) {
  const secPerBeat = 60 / bpm;
  const secPerThirtySecond = secPerBeat / 24;
  return secPerThirtySecond * 1000;
}

function findNoteFor(notes, time, column) {
  // 1. Calculate offset for time
  // 2. Calculate offset for time-50ms and time+50ms
  // 3. Return *earliest* note filtered for in that range with matching column
  return notes.filter((note) => {
    if (note.col !== column) {
      return false;
    }

    return (time + maxJudgementThreshold > note.time && time - maxJudgementThreshold < note.time);

  }).minBy((note) => note.offset);
}

function updatePlaybackOffset(state, dt) {
  const deltaOffset = dt / state.msPerOffset;

  return state.update('playbackOffset', (offset) => offset + deltaOffset);
}

function sweepMissedNotes(state) {
  const elapsed = Date.now() - state.startTime + state.initialOffsetTime;

  const missedNotes = state.notes.filter((note) => elapsed > note.time + maxJudgementThreshold);

  if (missedNotes.count() > 0) {
    return state
      .update('notes', (notes) => notes.subtract(missedNotes))
      .set('judgement', missedJudgement);
  } else {
    return state;
  }
}

const playbackReducer = createImmutableReducer(initialState, {
  [RESET_PLAYBACK]: function() {
    return initialState;
  },

  [ENTER_PLAYBACK]: function({offset, bpm, notes}, state) {
    const playbackRate = state.playbackRate;

    bpm = bpm * playbackRate;

    const msPerOffset = getMsPerOffset(bpm);

    notes = notes.map((note) => {
      const totalOffset = note.offset + note.beat * 24;
      const time = totalOffset * msPerOffset;
      return note.set('time', time);
    });

    notes = notes.toSet();

    return state
      .set('notes', notes)
      .set('bpm', bpm)
      .set('inPlayback', true)
      .set('initialOffsetTime', offset * msPerOffset)
      .set('playbackOffset', offset)
      .set('startTime', Date.now())
      .set('msPerOffset', msPerOffset);
  },

  [EXIT_PLAYBACK]: function(action, state) {
    // TODO: Stop runloop

    return state.set('inPlayback', false);
  },

  [PLAY_NOTE]: function({time, column}, state) {
    const elapsed = time - state.startTime + state.initialOffsetTime;
    const note = findNoteFor(state.notes, elapsed, column);

    if (!note) {
      return state;
    }

    return state
      .update('notes', (notes) => notes.remove(note))
      .set('judgement', judgementFor(elapsed - note.time));
  },

  [SET_RATE]: function({rate}, state) {
    return state.set('playbackRate', parseFloat(rate));
  },

  [PLAYBACK_TICK]: function({dt}, state) {
    const nextState = updatePlaybackOffset(state, dt);
    return sweepMissedNotes(nextState);
  },
});

export default playbackReducer;
