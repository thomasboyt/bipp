import ImmutableStore from '../util/ImmutableStore';
import { Record, List } from 'immutable';

const Note = Record({
  // Beat the note starts at (add offset)
  beat: 0,

  // Offset, in "24ths", from the start of the beat
  // e.g.: 0 is a 4th
  //       12 is an 8th
  //       8 and 16 are triplets ("12ths")
  //       6 and 18 are 16ths
  //       3 is a 32nd...
  offset: 0,

  // Column, between 0 and 6, for the note to be placed in
  col: 0
});

const StateRecord = Record({
  notes: null,
  bpm: null
});

class SongStore extends ImmutableStore {
  constructor(flux) {
    super({StateRecord});

    this.state = new StateRecord({
      notes: new List([]),
      bpm: 120
    });


    const songActions = flux.getActionIds('song');

    this.register(songActions.loadSong, this.handleLoadSong);

    this.register(songActions.toggleNote, this.handleToggleNote);
    this.register(songActions.changeBPM, this.handleChangeBPM);
  }


  /*
   * Data accessors
   */
  getNumMeasures(length) {
    const numBeats = Math.ceil(this.state.bpm / (60 / length));
    return Math.ceil(numBeats / 4);
  }

  /*
   * Loading
   */

  handleLoadSong(song) {
    const data = song.data;

    const noteRecords = data.notes.map((noteProps) => new Note(noteProps));
    const notes = new List(noteRecords);

    this.setState({
      notes,
      bpm: data.bpm
    });
  }

  /*
   * Adding & removing notes
   */
  handleToggleNote({offset, column}) {
    const beat = Math.floor(offset / 24);
    const offsetInBeat = offset % 24;

    const entry = this.state.notes.findEntry((note) => {
      return note.beat === beat && note.offset === offsetInBeat && note.col === column;
    });

    if (!entry) {
      const note = new Note({
        beat: beat,
        offset: offsetInBeat,
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

  handleChangeBPM(bpm) {
    this.setState({bpm});
  }


  /*
   * Serialization
   */

  serializeData() {
    const notes = this.state.notes;
    const bpm = this.state.bpm;

    return JSON.stringify({notes, bpm});
  }
}

export default SongStore;
