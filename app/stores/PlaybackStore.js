import { Store } from 'flummox';

class PlaybackStore extends Store {
  constructor(flux) {
    super(flux);

    const actionIds = flux.getActionIds('playback');

    this.register(actionIds.enterPlayback, this.handleEnterPlayback);
    this.register(actionIds.exitPlayback, this.handleExitPlayback);

    this.register(actionIds.playNote, this.handlePlayNote);

    this.state = {
      notes: null,
      bpm: null,

      inPlayback: false,
      playbackOffset: 0,

      startTime: null
    };
  }

  _getMsPerOffset(bpm) {
    const secPerBeat = 60 / bpm;
    const secPerThirtySecond = secPerBeat / 24;
    return secPerThirtySecond * 1000;
  }

  handleEnterPlayback({offset, bpm, notes}) {
    this._createPlaybackRunLoop();

    notes = notes.map((note) => {
      const totalOffset = note.offset + note.beat * 24;
      const time = totalOffset * this._getMsPerOffset(bpm);
      return note.set('time', time);
    });

    notes = notes.toSet();

    this.setState({
      notes: notes,
      inPlayback: true,
      playbackOffset: offset,
      bpm: bpm,
      startTime: Date.now(),
      msPerOffset: this._getMsPerOffset(bpm)
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

    const elapsedOffset = dt / this.state.msPerOffset;

    this.setState({
      playbackOffset: prevOffset + elapsedOffset
    });
  }


  _findNoteFor(time, column) {
    // 1. Calculate offset for time
    // 2. Calculate offset for time-50ms and time+50ms
    // 3. Return *earliest* note filtered for in that range with matching column
    return this.state.notes.filter((note) => {
      if (note.col !== column) {
        return false;
      }

      return (time + 75 > note.time && time - 75 < note.time);

    }).minBy((note) => note.offset);
  }

  handlePlayNote({time, column}) {
    const elapsed = time - this.state.startTime;
    const note = this._findNoteFor(elapsed, column);

    this.setState({
      notes: this.state.notes.remove(note)
    });
  }
}

export default PlaybackStore;
