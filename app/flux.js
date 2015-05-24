import Flummox from 'flummox';

import SongStore from './stores/SongStore';
import SongActions from './actions/SongActions';

import AudioStore from './stores/AudioStore';
import AudioActions from './actions/AudioActions';

import PlaybackStore from './stores/PlaybackStore';
import PlaybackActions from './actions/PlaybackActions';

class Flux extends Flummox {
  constructor() {
    super();

    this.createActions('song', SongActions);
    this.createStore('song', SongStore, this);

    this.createActions('audio', AudioActions);
    this.createStore('audio', AudioStore, this);

    this.createActions('playback', PlaybackActions);
    this.createStore('playback', PlaybackStore, this);
  }
}

const flux = new Flux();

export default flux;
