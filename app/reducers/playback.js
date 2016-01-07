import createImmutableReducer from '../util/immutableReducer';
import { Record, Map as IMap } from 'immutable';

import {
  RESET_PLAYBACK,
  ENTER_PLAYBACK,
  EXIT_PLAYBACK,
  PLAY_NOTE,
  SET_RATE,
  TICK,
} from '../ActionTypes';

/*
 * Constants
 */

import {judgements, missedJudgement} from '../config/constants';

export const maxJudgementThreshold = judgements[judgements.length - 1][0];

const OFFSET_PADDING = 24 * 4;  // One measure

/*
 * Initial state
 */

const State = new Record({
  notes: null,
  bpm: null,

  inPlayback: false,
  playbackOffset: 0,

  startTime: null,
  initialOffsetMs: null,
  msPerOffset: null,
  maxOffset: null,
  beatSpacing: null,

  judgement: null,
  judgements: null,
  combo: 0,
  elapsedMs: 0,

  playbackRate: 1
});

const initialState = new State();

/*
 * Utility methods
 */

function judgementFor(diff) {
  const absDiff = Math.abs(diff);
  const [threshold, label, keepCombo] = judgements.filter((j) => absDiff < j[0])[0];

  // - : you hit the note before it was supposed to be played (too early)
  // + : you hit the note after it was supposed to be played (too late)
  // const sign = diff < 0 ? '-' : '+';

  return {
    judgement: label,
    keepCombo,
  };
}

function getJudgementsMap() {
  const types = judgements.map((judgement) => judgement[1]).concat(missedJudgement);
  return new IMap(types.map((type) => [type, 0]));
}

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

  }).minBy((note) => note.totalOffset);
}

function updatePlaybackOffset(state, dt) {
  const deltaOffset = dt / state.msPerOffset;

  return state
    .update('elapsedMs', (elapsedMs) => elapsedMs + dt)
    .update('playbackOffset', (offset) => offset + deltaOffset);
}

function sweepMissedNotes(state) {
  const elapsed = state.elapsedMs + state.initialOffsetMs;

  const missedNotes = state.notes.filter((note) => elapsed > note.time + maxJudgementThreshold);

  if (missedNotes.count() > 0) {
    return state
      .update('notes', (notes) => notes.subtract(missedNotes))
      .set('judgement', missedJudgement)
      .set('combo', 0)
      .updateIn(['judgements', missedJudgement], (count) => count + missedNotes.count());
  } else {
    return state;
  }
}

/*
 * Reducer
 */

const playbackReducer = createImmutableReducer(initialState, {
  [RESET_PLAYBACK]: function() {
    return initialState;
  },

  [ENTER_PLAYBACK]: function({offset, bpm, notes, beatSpacing}, state) {
    const playbackRate = state.playbackRate;

    bpm = bpm * playbackRate;

    const msPerOffset = getMsPerOffset(bpm);

    const offsetWithStartPadding = offset - OFFSET_PADDING;

    notes = notes.map((note) => {
      const time = note.totalOffset * msPerOffset;

      return note.set('time', time);
    });

    notes = notes.toSet();

    const maxOffset = notes.maxBy((note) => note.totalOffset).totalOffset + OFFSET_PADDING;

    return state
      .set('notes', notes)
      .set('bpm', bpm)

      .set('inPlayback', true)
      .set('playbackOffset', offsetWithStartPadding)

      .set('startTime', Date.now())
      .set('initialOffsetMs', offsetWithStartPadding * msPerOffset)
      .set('msPerOffset', msPerOffset)
      .set('maxOffset', maxOffset)
      .set('beatSpacing', beatSpacing)

      .remove('judgement')
      .set('judgements', getJudgementsMap())
      .remove('combo')
      .remove('elapsedMs');
  },

  [EXIT_PLAYBACK]: function(action, state) {
    return state.set('inPlayback', false);
  },

  [PLAY_NOTE]: function({time, column}, state) {
    // This calculates time from the action, and not from the `elapsedMs` state, to be more
    // accurate to the original hit time.
    // The action supplies the time so that this reducer is actually testable
    const elapsed = time - state.startTime + state.initialOffsetMs;

    const note = findNoteFor(state.notes, elapsed, column);

    if (!note) {
      return state;
    }

    const offset = elapsed - note.time;
    const {judgement, keepCombo} = judgementFor(offset);

    if (keepCombo) {
      state = state.update('combo', (combo) => combo + 1);
    } else {
      state = state.set('combo', 0);
    }

    return state
      .update('notes', (notes) => notes.remove(note))
      .set('judgement', judgement)
      .updateIn(['judgements', judgement], (count) => count + 1);
  },

  [SET_RATE]: function({rate}, state) {
    return state.set('playbackRate', parseFloat(rate));
  },

  [TICK]: function({dt}, state) {
    if (!state.inPlayback) {
      return state;
    }

    const nextState = sweepMissedNotes(updatePlaybackOffset(state, dt));

    if (nextState.playbackOffset > nextState.maxOffset) {
      return state.set('inPlayback', false);
    }

    return nextState;
  },
});

export default playbackReducer;
