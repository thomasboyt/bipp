import expect from 'expect';

import reducer from '../playback';

describe('playback reducer', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toExist();
  });
});
