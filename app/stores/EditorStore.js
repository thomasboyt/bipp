import ImmutableStore from './ImmutableStore';
import { Record, List } from 'immutable';

const Note = Record({
  // Measure the note is within
  measure: 0,

  // Offset, in 32nds, from the start of the measure
  // e.g.: 0 is a 4th at the first beat of the measure
  //       8 is a 4th on the second beat
  //       4 is an 8th between the first and second beats
  offset: 0,

  // Column, between 0 and 6, for the note to be placed in
  col: 0
});

const StateRecord = Record({
  notes: null
});

const fixtureState = new StateRecord({
  notes: new List([
    new Note({ measure: 0, offset: 0, col: 0 }),
    new Note({ measure: 0, offset: 0, col: 4 }),
    new Note({ measure: 0, offset: 4, col: 3 }),
    new Note({ measure: 1, offset: 0, col: 1 }),
    new Note({ measure: 2, offset: 0, col: 2 })
  ])
});

class EditorStore extends ImmutableStore {
  constructor(flux) {
    super({StateRecord});

    this.state = fixtureState;
  }

  getNumMeasures() {
    return this.state.get('notes').maxBy((note) => note.get('measure')).get('measure') + 1;
  }
}

export default EditorStore;
