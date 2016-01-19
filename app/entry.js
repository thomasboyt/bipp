require('../styles/main.less');

// Set up runLoop
import runLoop from './runLoop';

// Load songs
// TODO: maybe do this elsewhere...
import songs from './config/songs';
import {loadSongs} from './actions/SongActions';

export default function init(store) {
  store.dispatch(loadSongs(songs));
  runLoop.setStore(store);
  runLoop.start();
}
