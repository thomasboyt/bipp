/*
 * This reducer contains playback state, including:
 *
 * - The (unplayed) notes of the chart
 * - Current playback offset & elapsed ms
 * - Scoring info (combo, judgments, life bar...)
 *
 * It gets completely reset every time playback is entered.
 */

import createImmutableReducer from '../util/immutableReducer';
import I from 'immutable';

import {
  ENTER_PLAYBACK,
  EXIT_PLAYBACK,
  PLAY_NOTE,
  SET_RATE,
  TICK,
} from '../ActionTypes';

/*
 *
 * Constants
 *
 */

import {judgements, missedJudgement} from '../config/constants';

export const maxJudgementThreshold = judgements[judgements.length - 1].threshold;

const OFFSET_PADDING = 24 * 4;  // One measure

/*
 *
 * Initial state
 *
 */

export const PlaybackState = I.Record({
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
  judgements: getJudgementsMap(),
  combo: 0,
  maxCombo: 0,
  elapsedMs: 0,
  hp: 50,

  playbackRate: 1
});

const initialState = new PlaybackState();

/*
 *
 * Utility methods
 *
 */

function judgementFor(diff) {
  const absDiff = Math.abs(diff);
  return judgements.filter((j) => absDiff < j.threshold)[0];
}

/*
 * Get a map of {judgementLabel: 0} for use for counting judgements
 */
function getJudgementsMap() {
  const types = judgements.concat(missedJudgement).map((judgement) => judgement.label);
  return new I.Map(types.map((type) => [type, 0]));
}

function getMsPerOffset(bpm) {
  const secPerBeat = 60 / bpm;
  const secPerThirtySecond = secPerBeat / 24;
  return secPerThirtySecond * 1000;
}

/*
 * Find a hit note for a given column and time.
 */
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

/*
 * Update the playback offset and elapsed milliseconds counters.
 */
function updatePlaybackOffset(state, dt) {
  const deltaOffset = dt / state.msPerOffset;

  return state
    .update('elapsedMs', (elapsedMs) => elapsedMs + dt)
    .update('playbackOffset', (offset) => offset + deltaOffset);
}

/*
 * Remove notes that have fallen out of the judgement window.
 */
function sweepMissedNotes(state) {
  const elapsed = state.elapsedMs + state.initialOffsetMs;

  const missedNotes = state.notes.filter((note) => elapsed > note.time + maxJudgementThreshold);

  if (missedNotes.count() > 0) {
    return missedNotes.reduce((state, note) => playNote(state, note, missedJudgement), state);
  } else {
    return state;
  }
}

function updateHp(state, judgement) {
  let hp = state.hp + judgement.hp;

  // hp can't go < 0 or > 100
  hp = hp < 0 ? 0 : hp;
  hp = hp > 100 ? 100 : hp;

  // TODO: if dead, do something
  return state
    .set('hp', hp);
}

/*
 * "Play" a note (also could indicate a miss). Removes the note, updates combo, sets
 * current judgement, and updates the judgement count and score.
 */
function playNote(state, note, judgement) {
  const label = judgement.label;

  return state
    .update('notes', (notes) => notes.remove(note))
    .update((state) => {
      if (judgement.keepCombo) {
        return incCombo(state);
      } else {
        return state.set('combo', 0);
      }
    })
    .set('judgement', judgement)
    .update((state) => updateHp(state, judgement))
    .updateIn(['judgements', label], (count) => count + 1);
}

/*
 * Increment combo. Called if a note was played. Update maxCombo if necessary.
 */
function incCombo(state) {
  const combo = state.get('combo') + 1;

  return state
    .set('combo', combo)
    .update('maxCombo', (maxCombo) => combo > maxCombo ? combo : maxCombo);
}

/*
 *
 * Reducer
 *
 */

const playbackReducer = createImmutableReducer(initialState, {
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

    return new PlaybackState({
      notes,
      bpm,

      inPlayback: true,
      playbackOffset: offsetWithStartPadding,

      startTime: Date.now(),  // TODO: probably should supply this from the action for testing
      initialOffsetMs: offsetWithStartPadding * msPerOffset,
      msPerOffset,
      maxOffset,
      beatSpacing,
    });
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
    const judgement = judgementFor(offset);

    return playNote(state, note, judgement);
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
