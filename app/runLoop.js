import {
  PLAYBACK_TICK,
} from './ActionTypes';

class RunLoop {
  constructor(store) {
    this.store = store;
    this.inPlayback = false;

    this.store.subscribe(this.maybeUpdatePlayback.bind(this));
  }

  start() {
    let prev = Date.now();

    let runLoop = () => {
      const now = Date.now();
      const dt = now - prev;
      prev = now;

      this.store.dispatch({
        type: PLAYBACK_TICK,
        dt,
      });

      window.requestAnimationFrame(runLoop);
    };

    this.unsetPlaybackRunLoop = () => {
      runLoop = () => {};
    };

    window.requestAnimationFrame(runLoop);

    this.inPlayback = true;
  }

  stop() {
    this.unsetPlaybackRunLoop();

    this.inPlayback = false;
  }

  maybeUpdatePlayback() {
    const state = this.store.getState();

    if (!state.playback.inPlayback && this.inPlayback) {
      this.stop();
    } else if (state.playback.inPlayback && !this.inPlayback) {
      this.start();
    }
  }
}

function createPlaybackRunLoop(...args) {
  return new RunLoop(...args);
}

export default createPlaybackRunLoop;
