import createImmutableReducer from '../util/immutableReducer';
import { Record, List } from 'immutable';

import {
  LOAD_SONG,
  TOGGLE_NOTE,
  CHANGE_BPM,
} from '../ActionTypes';

export const Note = Record({
  // Offset, in "24ths", from the start of the beat
  // e.g.: 0 is a 4th
  //       12 is an 8th
  //       8 and 16 are triplets ("12ths")
  //       6 and 18 are 16ths
  //       3 is a 32nd...
  totalOffset: 0,

  // Column, between 0 and 6, for the note to be placed in
  col: 0,

  // Calculated at playback time, not saved
  time: 0,
});

const StateRecord = Record({
  loaded: false,
  notes: null,
  bpm: null,
  songInfo: null
});

const initialState = new StateRecord({
  loaded: false,
});

const chartReducer = createImmutableReducer(initialState, {
  [LOAD_SONG]: function({song, difficulty}) {
    const chart = song.data[difficulty];
    const noteRecords = chart.notes.map((noteProps) => new Note(noteProps));
    const notes = new List(noteRecords);

    return new StateRecord({
      loaded: true,
      notes,
      bpm: song.bpm,

      songInfo: {
        title: song.title,
        artist: song.artist,
        youtubeId: song.youtubeId,
        img: song.img,
      }
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
