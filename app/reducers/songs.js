/*
 * This reducer holds the loaded list of songs.
 */

import createImmutableReducer from '../util/immutableReducer';
import I from 'immutable';
import slugify from 'slug';

import {LOAD_SONGS} from '../ActionTypes';

import {
  Song,
} from '../records';

export const SongsState = I.Record({
  songs: null,
});

const initialState = new SongsState();


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
