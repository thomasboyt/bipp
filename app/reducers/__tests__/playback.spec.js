import expect from 'expect';

import chartReducer from '../chart';
import {
  default as reducer,
  maxJudgementThreshold
} from '../playback';

import {
  LOAD_SONG,

  PLAY_NOTE,
  ENTER_PLAYBACK,
  TICK,
} from '../../ActionTypes';

// TODO: maybe don't rely on this? I dunno
import song from '../../../songs/demo/click';

const chart = chartReducer(undefined, {
  type: LOAD_SONG,
  song,
  difficulty: 'easy',
});

describe('playback reducer', () => {

  describe('playing notes', () => {
    const initState = reducer(undefined, {
      type: ENTER_PLAYBACK,
      offset: 0,
      bpm: chart.bpm,
      notes: chart.notes,
      beatSpacing: 0,
    });

    // time of first note, which is at offset = 0
    // TODO: this could be some kind of util method, getTimeFor(offset)
    const initTime = initState.startTime - initState.initialOffsetMs;

    it('playing a note increments combo', () => {
      const playedState = reducer(initState, {
        type: PLAY_NOTE,
        time: initTime,
        column: 3,
      });

      expect(playedState.combo).toEqual(1);
      expect(playedState.maxCombo).toEqual(1);
    });

    it('missing a note resets combo', () => {
      const playedState = reducer(initState, {
        type: PLAY_NOTE,
        time: initTime,
        column: 3,
      });

      expect(playedState.combo).toEqual(1);

      // tick past the second note's threshold window to allow sweep
      const missedState = reducer(playedState, {
        type: TICK,
        dt: -playedState.initialOffsetMs + (playedState.msPerOffset * 24) + maxJudgementThreshold + 1,
      });

      expect(missedState.combo).toEqual(0);
      expect(playedState.maxCombo).toEqual(1);
    });
  });
});
