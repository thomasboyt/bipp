/*
 * This reducer holds the state of the currently-loaded chart & song.
 */

import createImmutableReducer from '../util/immutableReducer';
import I from 'immutable';

import {
  LOAD_SONG,
  TOGGLE_NOTE,
  CHANGE_BPM,
} from '../ActionTypes';

import {
  Note,
} from '../records';

export const ChartState = I.Record({
  loaded: false,
  notes: null,
  bpm: null,
  song: null
});

const initialState = new ChartState();

const chartReducer = createImmutableReducer(initialState, {
  [LOAD_SONG]: function({song, difficulty}) {
    const chart = song.data[difficulty];
    const noteRecords = chart.notes.map((noteProps) => new Note(noteProps));
    const notes = new I.List(noteRecords);

    return new ChartState({
      loaded: true,
      notes,
      bpm: song.bpm,

      song: song,
    });
  },

  [TOGGLE_NOTE]: function({offset, column}, state) {
    const entry = state.notes.findEntry((note) => {
      return note.totalOffset === offset && note.col === column;
    });

    if (!entry) {
      const note = new Note({
        col: column,
        totalOffset: offset,
      });

      return state.updateIn(['notes'], (notes) => notes.push(note));

    } else {
      const idx = entry[0];

      return state.updateIn(['notes'], (notes) => notes.remove(idx));
    }
  },

  [CHANGE_BPM]: function({bpm}, state) {
    return state.set('bpm', bpm);
  },
});

export default chartReducer;
