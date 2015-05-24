import { Store } from 'flummox';
import AvgTick from '../util/AvgTick';

class PlaybackStore extends Store {
  constructor(flux) {
    super(flux);

    const actionIds = flux.getActionIds('playback');

    this.register(actionIds.enterPlayback, this.handleEnterPlayback);
    this.register(actionIds.exitPlayback, this.handleExitPlayback);

    this.state = {
      notes: null,
      bpm: null,

      inPlayback: false,
      playbackOffset: 0,
      playbackFps: null
    };
  }

  /*
   * Playback things
   * TODO: Move some of this to a new store?
   */

  handleEnterPlayback({offset, bpm}) {
    this._createPlaybackRunLoop();

    this.setState({
      inPlayback: true,
      playbackOffset: offset,
      bpm: bpm
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

  _updatePlaybackOffset(dt) {
    const prevOffset = this.state.playbackOffset;

    const bpm = this.state.bpm;
    const secPerBeat = 60 / bpm;
    const secPerThirtySecond = secPerBeat / 24;
    const elapsedOffset = (dt / (secPerThirtySecond * 1000));

    this._avgTick.update(dt);

    this.setState({
      playbackOffset: prevOffset + elapsedOffset,
      playbackFps: 1000 / this._avgTick.get()
    });
  }
}

export default PlaybackStore;
