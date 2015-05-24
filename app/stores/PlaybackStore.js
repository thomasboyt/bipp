import { Store } from 'flummox';
import AvgTick from '../util/AvgTick';

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
      playbackFps: null,

      startTime: null
    };
  }


  handleEnterPlayback({offset, bpm, notes}) {
    this._createPlaybackRunLoop();

    this.setState({
      notes: notes,
      inPlayback: true,
      playbackOffset: offset,
      bpm: bpm,
      startTime: Date.now()
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

    this._avgTick = new AvgTick(100);
    window.requestAnimationFrame(runLoop);
  }

  _getMsPerOffset() {
    const bpm = this.state.bpm;
    const secPerBeat = 60 / bpm;
    const secPerThirtySecond = secPerBeat / 24;
    return secPerThirtySecond * 1000;
  }

  _updatePlaybackOffset(dt) {
    const prevOffset = this.state.playbackOffset;

    const elapsedOffset = dt / this._getMsPerOffset();

    this._avgTick.update(dt);

    this.setState({
      playbackOffset: prevOffset + elapsedOffset,
      playbackFps: 1000 / this._avgTick.get()
    });
  }

  _findNoteFor(time, column) {
    // 1. Calculate offset for time
    // 2. Calculate offset for time-50ms and time+50ms
    // 3. Return *earliest* note filtered for in that range with matching column
    return this.state.notes.filter((note) => note.col === column)
                    .filter((note) => {
                      const offset = note.offset + note.beat * 24;
                      const noteTime = offset * this._getMsPerOffset();
                      return (time + 75 > noteTime && time - 75 < noteTime);
                    })
                    .minBy((note) => note.offset);
  }


  handlePlayNote({time, column}) {
    const elapsed = time - this.state.startTime;
    const foundNote = this._findNoteFor(elapsed, column);

    this.setState({
      notes: this.state.notes.filter((note) => foundNote !== note)
    });
  }
}

export default PlaybackStore;
