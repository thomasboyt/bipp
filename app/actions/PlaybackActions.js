import {Actions} from 'flummox';

class PlaybackActions extends Actions {
  enterPlayback(offset, bpm) {
    return {offset, bpm};
  }

  exitPlayback() {
    return {};
  }
}

export default PlaybackActions;
