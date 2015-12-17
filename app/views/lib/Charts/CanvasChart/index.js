import React from 'react';
import I from 'immutable';
import _ from 'lodash';

import ordinal from '../../../../util/ordinal';

import RenderedCanvas from './RenderedCanvas';

import {LANE_WIDTH, CENTER_LANE_WIDTH, NOTE_HEIGHT, colors, WIDTH} from '../constants';

export {WIDTH};
export const HEIGHT = 720;

function renderOffsetBar(ctx, {offsetBarY}) {
  ctx.fillStyle = '#4A90E2';
  ctx.fillRect(0, offsetBarY - (NOTE_HEIGHT / 2), WIDTH, NOTE_HEIGHT);
}

function renderNote(ctx, {note, y}) {
  let x, width;
  if (note.col < 3) {
    x = note.col * LANE_WIDTH;
    width = LANE_WIDTH;
  } else if (note.col === 3) {
    x = note.col * LANE_WIDTH;
    width = CENTER_LANE_WIDTH;
  } else if (note.col > 3) {
    x = CENTER_LANE_WIDTH + (note.col - 1) * LANE_WIDTH;
    width = LANE_WIDTH;
  }

  ctx.fillStyle = colors[note.col][0];
  ctx.strokeStyle = colors[note.col][1];

  ctx.fillRect(x, y, width, NOTE_HEIGHT);
  ctx.strokeRect(x, y, width, NOTE_HEIGHT);
}

export function renderNotes(ctx, {notes, offset, beatSpacing, offsetBarY}) {
  notes.forEach((note) => {
    const noteOffset = note.totalOffset - offset;

    const y = ((beatSpacing / 24) * noteOffset) - (NOTE_HEIGHT / 2) + offsetBarY;

    renderNote(ctx, {note, y});
  });
}

function renderBeatLine(ctx, {y, wholeNote}) {
  ctx.save();

  if (wholeNote) {
    ctx.lineWidth = 3;
  } else {
    ctx.lineWidth = 1;
  }

  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(WIDTH, y);
  ctx.stroke();

  ctx.restore();
}

function renderMeasures(ctx, {offset, offsetBarY, beatSpacing, minimumOffset, maximumOffset}) {
  const beatOffsets = _.range(Math.floor(minimumOffset), Math.ceil(maximumOffset))
    .filter((val) => val % 24 === 0 && val >= 0);

  beatOffsets.forEach((beatOffset) => {
    const offsetDiff = beatOffset - offset;

    const y = ((beatSpacing / 24) * offsetDiff) + offsetBarY;

    renderBeatLine(ctx, {y, wholeNote: beatOffset % 96 === 0});
  });
}

function renderOffsetText(ctx, {offset, offsetBarY, scrollResolution}) {
  const noteName = ordinal((24 / scrollResolution) * 4);
  const beat = Math.floor(offset / 24 / 4) + 1;

  ctx.font = '16px Helvetica';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'right';

  ctx.fillText(noteName, WIDTH + 50, HEIGHT - offsetBarY - 5);
  ctx.fillText(beat, WIDTH + 50, HEIGHT - offsetBarY + 20 - 5);
}

export function renderChart(ctx, {notes, offset, offsetPositionYPercent, beatSpacing,
                            showMeasures, showOffsetText, scrollResolution}) {
  ctx.save();
  ctx.translate(0, HEIGHT);
  ctx.scale(1, -1);

  const offsetY = offset * (beatSpacing / 24);

  const offsetBarY = (1 - offsetPositionYPercent) * HEIGHT;

  renderOffsetBar(ctx, {offsetBarY, WIDTH});

  const minimumY = offsetY - offsetBarY - (NOTE_HEIGHT / 2);
  const maximumY = offsetY + (HEIGHT - offsetBarY) + (NOTE_HEIGHT / 2);
  const minimumOffset = minimumY / (beatSpacing / 24);
  const maximumOffset = maximumY / (beatSpacing / 24);

  const notesToRender = notes.filter((note) => minimumOffset < note.totalOffset && note.totalOffset < maximumOffset);

  if (showMeasures) {
    renderMeasures(ctx, {offset, offsetBarY, beatSpacing, minimumOffset, maximumOffset});
  }

  renderNotes(ctx, {
    notes: notesToRender,
    offset,
    offsetBarY,
    beatSpacing,
  });

  ctx.restore();

  if (showOffsetText) {
    renderOffsetText(ctx, {offset, offsetBarY, scrollResolution});
  }
}

const CanvasChart = React.createClass({
  propTypes: {
    notes: React.PropTypes.oneOfType([
      React.PropTypes.instanceOf(I.Set),
      React.PropTypes.instanceOf(I.List)
    ]).isRequired,

    offset: React.PropTypes.number.isRequired,
    offsetPositionYPercent: React.PropTypes.number.isRequired,
    beatSpacing: React.PropTypes.number.isRequired,
    numMeasures: React.PropTypes.number.isRequired,

    // Editor stuff
    showMeasures: React.PropTypes.bool,
    showOffsetText: React.PropTypes.bool,
    scrollResolution: React.PropTypes.number,
  },

  render() {
    // Add padding if we're displaying right-hand chart information in editor
    // (we don't want to do this in player b/c it'll mess up centering)
    const width = this.props.showOffsetText ? WIDTH + 100 : WIDTH;

    return (
      <div className="chart-overflower">
        <RenderedCanvas render={renderChart} params={this.props}
          height={HEIGHT} width={width} />
      </div>
    );
  }
});

export default CanvasChart;
