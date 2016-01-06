import createImmutableReducer from '../util/immutableReducer';
import I from 'immutable';
import slugify from 'slug';

import {LOAD_SONGS} from '../ActionTypes';

const Song = I.Record({
  title: null,
  artist: null,
  data: null,
  bpm: null,
  musicUrl: null,
  img: null,
  slug: null,
});

const State = I.Record({
  songs: null,
});

const initialState = new State();


const songsReducer = createImmutableReducer(initialState, {
  [LOAD_SONGS]: function({songs}, state) {
    const songMap = songs.reduce((map, song) => {
      const slug = slugify(song.title);

      return map.set(slug, new Song({
        slug,
        ...song,
      }));
    }, I.Map());

    return state.set('songs', songMap);
  }
});

export default songsReducer;
