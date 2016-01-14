import expect from 'expect';

import React from 'react';
import {renderIntoDocument} from 'react-addons-test-utils';
import {Provider} from 'react-redux';
import Mousetrap from 'mousetrap';
import createStore from '../../../store';
import {loadSongs} from '../../../actions/SongActions';
import {loadSong, toggleNote} from '../../../actions/ChartActions';

// TODO: use some kinda fixture song here instead
import songs from '../../../config/songs';
import {LOAD_AUDIO} from '../../../ActionTypes';

import Editor from '../Handler';

import {
  keyColMap as colMap,
} from '../../../config/constants';

const SONG_SLUG = 'Click';
const DIFFICULTY = 'easy';

describe('Editor component', () => {
  let store;

  beforeEach(() => {
    // Create a store for the editor with the 'click' song and fake audio data loaded
    // so that it enters its "loaded" state immediately
    store = createStore();
    store.dispatch(loadSongs(songs));

    // Load chart
    const song = store.getState().songs.songs.get(SONG_SLUG);
    store.dispatch(loadSong(song, DIFFICULTY));

    // load some fake audio data immediately
    store.dispatch({
      type: LOAD_AUDIO,
      song,
      audioData: new ArrayBuffer(0)
    });
  });

  afterEach(() => {
    expect.restoreSpies();
  });

  it('toggles note on key press', () => {
    const spy = expect.spyOn(store, 'dispatch').andCallThrough();

    renderIntoDocument(
      <Provider store={store}>
        <Editor params={{slug: SONG_SLUG, difficulty: DIFFICULTY}} />
      </Provider>
    );

    // get an arbitrary key from the key->column mapping
    const key = Object.keys(colMap)[0];
    const col = colMap[key];

    Mousetrap.trigger(key);

    // Assume the last dispatch is from the key press
    expect(spy).toHaveBeenCalled();
    const dispatchCall = spy.calls[spy.calls.length - 1];

    expect(dispatchCall.arguments[0]).toEqual(toggleNote(0, col));
  });
});
