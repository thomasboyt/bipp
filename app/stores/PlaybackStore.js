import { Store } from 'flummox';

const initialState = {
  notes: null,
  bpm: null,

  inPlayback: false,
  playbackOffset: null,

  startTime: null,
  initialOffsetTime: null,
  msPerOffset: null
};

// ripped off from In the Groove http://r21freak.com/phpbb3/viewtopic.php?p=326033#p326033
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
  const absDiff = Math.abs(diff);
  const label = judgements.filter((j) => absDiff < j[0])[0][1];
  const sign = diff < 0 ? '-' : '+';
  return `${label} ${sign}`;
};

class PlaybackStore extends Store {
  constructor(flux) {
    super(flux);

    const actionIds = flux.getActionIds('playback');

    this.register(actionIds.enterPlayback, this.handleEnterPlayback);
    this.register(actionIds.exitPlayback, this.handleExitPlayback);

    this.register(actionIds.playNote, this.handlePlayNote);

    this.state = initialState;
  }

  reset() {
    if (this.state.inPlayback) {
      this._stopPlaybackRunLoop();
    }

    this.setState(initialState);
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

    const msPerOffset = this._getMsPerOffset(bpm);

    this.setState({
      notes,
      bpm,
      inPlayback: true,
      initialOffsetTime: offset * msPerOffset,
      playbackOffset: offset,
      startTime: Date.now(),
      msPerOffset
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
      this._removeMissedNotes();

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

  _removeMissedNotes() {
    const elapsed = Date.now() - this.state.startTime + this.state.initialOffsetTime;

    const missedNotes = this.state.notes.filter((note) => elapsed > note.time + maxJudgementThreshold);

    if (missedNotes.count() > 0) {
      this.setState({
        notes: this.state.notes.subtract(missedNotes),
        judgement: missedJudgement
      });
    }
  }


  _findNoteFor(time, column) {
    // 1. Calculate offset for time
    // 2. Calculate offset for time-50ms and time+50ms
    // 3. Return *earliest* note filtered for in that range with matching column
    return this.state.notes.filter((note) => {
      if (note.col !== column) {
        return false;
      }

      return (time + maxJudgementThreshold > note.time && time - maxJudgementThreshold < note.time);

    }).minBy((note) => note.offset);
  }

  handlePlayNote({time, column}) {
    const elapsed = time - this.state.startTime + this.state.initialOffsetTime;
    const note = this._findNoteFor(elapsed, column);

    if (!note) {
      return;
    }

    this.setState({
      notes: this.state.notes.remove(note),
      judgement: judgementFor(elapsed - note.time)
    });
  }
}

export default PlaybackStore;
