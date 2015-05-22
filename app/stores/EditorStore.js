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
  notes: null,
  bpm: null,

  inPlayback: false,
  playbackOffset: 0
});

const fixtureState = new StateRecord({
  notes: new List([
    new Note({ measure: 0, offset: 0, col: 0 }),
    new Note({ measure: 0, offset: 0, col: 4 }),
    new Note({ measure: 0, offset: 16, col: 3 }),
    new Note({ measure: 1, offset: 0, col: 1 }),
    new Note({ measure: 32, offset: 0, col: 2 })
  ]),
  bpm: 144
});

class EditorStore extends ImmutableStore {
  constructor(flux) {
    super({StateRecord});

    this.state = fixtureState;

    const actionIds = flux.getActionIds('editor');

    this.register(actionIds.toggleNote, this.handleToggleNote);

    this.register(actionIds.enterPlayback, this.handleEnterPlayback);
    this.register(actionIds.exitPlayback, this.handleExitPlayback);
  }


  /*
   * Data accessors
   */
  getNumMeasures() {
    return this.state.get('notes').maxBy((note) => note.get('measure')).get('measure') + 1;
  }


  /*
   * Adding & removing notes
   */
  handleToggleNote({offset, column}) {
    const measure = Math.floor(offset / 32);
    const offsetInMeasure = offset % 32;

    const entry = this.state.notes.findEntry((note) => {
      return note.measure === measure && note.offset === offsetInMeasure && note.col === column;
    });

    if (!entry) {
      const note = new Note({
        measure: measure,
        offset: offsetInMeasure,
        col: column
      });

      this.setState({
        notes: this.state.notes.push(note)
      });

    } else {
      const idx = entry[0];
      this.setState({
        notes: this.state.notes.remove(idx)
      });
    }
  }

  /*
   * Playback things
   */

  handleEnterPlayback({offset}) {
    this._createPlaybackRunLoop();

    this.setState({
      inPlayback: true,
      playbackOffset: offset
    });
  }

  handleExitPlayback() {
    this._stopPlaybackRunLoop();

    this.setState({
      inPlayback: false
    });
  }

  _createPlaybackRunLoop() {
    let prev = Date.now();

    let runLoop = () => {
      const now = Date.now();
      const dt = now - prev;
      prev = now;

      this._updatePlaybackOffset(dt);

      window.requestAnimationFrame(runLoop);
    };

    this._stopPlaybackRunLoop = () => {
      runLoop = () => {};
    };

    window.requestAnimationFrame(runLoop);
  }

  _updatePlaybackOffset(dt) {
    const prevOffset = this.state.playbackOffset;

    const bpm = this.state.bpm;
    const secPerBeat = 60 / bpm;
    const secPerThirtySecond = secPerBeat / 8;
    const elapsedOffset = (dt / (secPerThirtySecond * 1000));

    this.setState({
      playbackOffset: prevOffset + elapsedOffset
    });
  }
}

export default EditorStore;
