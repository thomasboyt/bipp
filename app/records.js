import I from 'immutable';

/*
 * This file contains common Records shared between reducers and used in component PropTypes.
 *
 * It doesn't contain reducer state Records, since those are never referenced outside of reducer
 * files and their tests.
 */

export const Note = I.Record({
  // Offset, in "24ths", from the start of the beat
  // e.g.: 0 is a 4th
  //       12 is an 8th
  //       8 and 16 are triplets ("12ths")
  //       6 and 18 are 16ths
  //       3 is a 32nd...
  totalOffset: 0,

  // Column, between 0 and 6, for the note to be placed in
  col: 0,

  // Calculated at playback time, not saved
  time: 0,
});

export const Song = I.Record({
  title: null,
  artist: null,
  data: null,
  bpm: null,
  musicUrl: null,
  img: null,
  slug: null,
  hidden: false,
});
