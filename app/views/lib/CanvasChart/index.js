import React from 'react';
import I from 'immutable';

import RenderedCanvas from './RenderedCanvas';

import {LANE_WIDTH, CENTER_LANE_WIDTH, NOTE_HEIGHT, colors} from '../Chart/constants';

function renderOffsetBar(ctx, {offsetBarY, viewportWidth}) {
  ctx.fillStyle = '#4A90E2';
  ctx.fillRect(0, offsetBarY - (NOTE_HEIGHT / 2), viewportWidth, NOTE_HEIGHT);
}

function renderNote(ctx, note, y) {
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

function renderChart(ctx, {notes, offset, offsetPositionYPercent, beatSpacing, measures}) {
  const viewportHeight = ctx.canvas.height;
  const viewportWidth = ctx.canvas.width;

  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, viewportWidth, viewportHeight);

  const offsetY = offset * (beatSpacing / 24);

  const offsetBarY = (1 - offsetPositionYPercent) * viewportHeight;

  renderOffsetBar(ctx, {offsetBarY, viewportWidth});

  /*
   * Goal: *find notes that need to be rendered*
   * Filter out notes with offset over calculated value calculated from maximum Y
   * (don't need to go under because they'll be removed)
   */
  const maximumY = offsetY + viewportHeight;
  const maximumOffset = maximumY / (beatSpacing / 24);

  const notesToRender = notes.filter((note) => note.totalOffset < maximumOffset);

  notesToRender.forEach((note) => {
    const noteOffset = note.totalOffset - offset;

    const y = ((beatSpacing / 24) * noteOffset) - (NOTE_HEIGHT / 2) + offsetBarY;

    renderNote(ctx, note, y);
  });

  // TODO: Render measures
}

const CanvasChart = React.createClass({
  propTypes: {
    notes: React.PropTypes.instanceOf(I.Set).isRequired,

    offset: React.PropTypes.number.isRequired,
    offsetPositionYPercent: React.PropTypes.number.isRequired,
    beatSpacing: React.PropTypes.number.isRequired,
    numMeasures: React.PropTypes.number.isRequired,
  },

  render() {
    return (
      <div className="chart-overflower">
        <RenderedCanvas render={renderChart} params={this.props}
          height="720" width="450" style={{transform: 'scale(1, -1)'}} />
      </div>
    );
  }
});

export default CanvasChart;
