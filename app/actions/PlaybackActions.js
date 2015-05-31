import {Actions} from 'flummox';

class PlaybackActions extends Actions {
  enterPlayback(offset, bpm, notes) {
    return {offset, bpm, notes};
  }

  exitPlayback() {
    return {};
  }

  playNote(time, column) {
    return {time, column};
  }

  updateRate(rate) {
    return rate;
  }
}

export default PlaybackActions;
