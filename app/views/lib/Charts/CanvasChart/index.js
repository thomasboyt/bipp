import React from 'react';
import I from 'immutable';
import _ from 'lodash';

import ordinal from '../../../../util/ordinal';

import RenderedCanvas from '../../RenderedCanvas';

import {LANE_WIDTH, CENTER_LANE_WIDTH, NOTE_HEIGHT, WIDTH} from '../constants';
import {SHOW_FPS} from '../../../../config/flags';

export {WIDTH};
export const HEIGHT = 720;

function renderOffsetBar(ctx, {offsetBarY, colors}) {
  ctx.fillStyle = colors.offsetBarFillStyle;
  ctx.fillRect(0, offsetBarY - (NOTE_HEIGHT / 2), WIDTH, NOTE_HEIGHT);
}

function getColumnWidth(col) {
  if (col === 3) {
    return CENTER_LANE_WIDTH;
  }

  return LANE_WIDTH;
}

function getColumnX(col) {
  if (col <= 3) {
    return col * LANE_WIDTH;
  }

  return CENTER_LANE_WIDTH + (col - 1) * LANE_WIDTH;
}

function renderNote(ctx, {colors, note, y}) {
  const x = getColumnX(note.col);
  const width = getColumnWidth(note.col);

  ctx.fillStyle = colors.noteColors[note.col][0];
  ctx.strokeStyle = colors.noteColors[note.col][1];

  ctx.fillRect(x, y, width, NOTE_HEIGHT);
  ctx.strokeRect(x, y, width, NOTE_HEIGHT);
}

export function renderNotes(ctx, {colors, notes, offset, beatSpacing, offsetBarY}) {
  notes.forEach((note) => {
    const noteOffset = note.totalOffset - offset;

    const y = ((beatSpacing / 24) * noteOffset) - (NOTE_HEIGHT / 2) + offsetBarY;

    renderNote(ctx, {colors, note, y});
  });
}

function renderColumns(ctx, {colors, /*offsetBarY*/}) {
  for (let col = 1; col < 7; col += 1) {
    const x = getColumnX(col);

    // TODO: light up gradients when key is pressed down?
    // const width = getColumnWidth(col);
    // const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    //
    // gradient.addColorStop(0, colors[col][0]);
    // gradient.addColorStop(offsetBarY / HEIGHT, colors[col][0]);
    // gradient.addColorStop(1, 'rgba(0,0,0,0)');
    //
    // ctx.fillStyle = gradient;
    // ctx.fillRect(x, 0, width, HEIGHT);

    ctx.strokeStyle = colors.separatorStyle;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
}

function renderBeatLine(ctx, {colors, y, wholeNote}) {
  ctx.save();

  if (wholeNote) {
    ctx.lineWidth = 3;
  } else {
    ctx.lineWidth = 1;
  }

  ctx.strokeStyle = colors.beatLineStyle;
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(WIDTH, y);
  ctx.stroke();

  ctx.restore();
}

function renderMeasures(ctx, {colors, offset, offsetBarY, beatSpacing, minimumOffset, maximumOffset}) {
  const beatOffsets = _.range(Math.floor(minimumOffset), Math.ceil(maximumOffset))
    .filter((val) => val % 24 === 0 && val >= 0);

  beatOffsets.forEach((beatOffset) => {
    const offsetDiff = beatOffset - offset;

    const y = ((beatSpacing / 24) * offsetDiff) + offsetBarY;

    renderBeatLine(ctx, {colors, y, wholeNote: beatOffset % 96 === 0});
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

function renderFPS(ctx, {fps}) {
  ctx.textAlign = 'right';
  ctx.fillStyle = 'green';
  ctx.font = '16px Helvetica';
  ctx.fillText(Math.round(fps), WIDTH - 5, 20);
}

export function renderChart(ctx, {colors, notes, offset, offsetPositionYPercent, beatSpacing,
                            showMeasures, showOffsetText, scrollResolution, fps}) {
  ctx.save();
  ctx.translate(0, HEIGHT);
  ctx.scale(1, -1);

  const offsetY = offset * (beatSpacing / 24);

  const offsetBarY = (1 - offsetPositionYPercent) * HEIGHT;

  renderColumns(ctx, {offsetBarY, colors});

  renderOffsetBar(ctx, {offsetBarY, WIDTH, colors});

  const minimumY = offsetY - offsetBarY - (NOTE_HEIGHT / 2);
  const maximumY = offsetY + (HEIGHT - offsetBarY) + (NOTE_HEIGHT / 2);
  const minimumOffset = minimumY / (beatSpacing / 24);
  const maximumOffset = maximumY / (beatSpacing / 24);

  const notesToRender = notes.filter((note) => minimumOffset < note.totalOffset && note.totalOffset < maximumOffset);

  if (showMeasures) {
    renderMeasures(ctx, {offset, offsetBarY, beatSpacing, minimumOffset, maximumOffset, colors});
  }

  renderNotes(ctx, {
    notes: notesToRender,
    offset,
    offsetBarY,
    beatSpacing,
    colors,
  });

  ctx.restore();

  if (showOffsetText) {
    renderOffsetText(ctx, {offset, offsetBarY, scrollResolution});
  }

  if (SHOW_FPS) {
    renderFPS(ctx, {fps});
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

    fps: React.PropTypes.number.isRequired,
    colors: React.PropTypes.object.isRequired,
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
