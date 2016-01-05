import expect from 'expect';
import I from 'immutable';

import {Note} from '../../../../../reducers/chart';
import {NOTE_HEIGHT} from '../../constants';
import {playerColors} from '../../../../../config/constants';

import {
  WIDTH,
  HEIGHT,
  renderNotes,
} from '../';

class MockContext {
  constructor() {
    this.canvas = {
      width: WIDTH,
      height: HEIGHT,
    };

    this.fillRect = expect.createSpy();
    this.strokeRect = expect.createSpy();
  }
}

describe('<CanvasChart>', () => {
  it('renders notes on the judgement line when the scroll offset matches the note offset', () => {
    const offsetPositionYPercent = 0.9;
    const offset = 20 * 24 + 12;

    const note = new Note({
      col: 0,
      totalOffset: offset,
    });

    const ctx = new MockContext();

    const offsetBarY = (1 - offsetPositionYPercent) * HEIGHT;

    renderNotes(ctx, {
      colors: playerColors,
      notes: I.Set([note]),
      beatSpacing: 160,
      offset,
      offsetBarY,
    });

    expect(ctx.fillRect.calls.length).toEqual(1);
    expect(ctx.fillRect.calls[0].arguments[1]).toEqual(offsetBarY - (NOTE_HEIGHT / 2));
  });
});
