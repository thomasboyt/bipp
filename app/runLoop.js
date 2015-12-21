import {
  TICK,
} from './ActionTypes';

class RunLoop {
  constructor() {
    this.store = null;
    this._listeners = [];

    let prev = Date.now();

    let runLoop = () => {
      const now = Date.now();
      const dt = now - prev;
      prev = now;

      this.store.dispatch({
        type: TICK,
        dt,
      });

      this._listeners.forEach((listener) => listener());

      window.requestAnimationFrame(runLoop);
    };

    this.unsetPlaybackRunLoop = () => {
      runLoop = () => {};
    };

    window.requestAnimationFrame(runLoop);
  }

  setStore(store) {
    this.store = store;
  }

  subscribe(listener) {
    this._listeners.push(listener);
  }

  unsubscribe(listener) {
    const idx = this._listeners.indexOf(listener);

    if (idx === -1) {
      throw new Error('tried to unsubscribe listener that wasn\'t subscribed');
    }

    this._listeners.splice(idx, 1);
  }
}

const runLoop = new RunLoop();

export default runLoop;
