import React from 'react';
import ordinal from '../../../util/ordinal';
import { Range, List } from 'immutable';
import pureRender from '../../../util/pureRender';

const VIEWPORT_HEIGHT = 600;
const WIDTH = 450;
const LANE_WIDTH = 60;
const NOTE_HEIGHT = 20;

/**
 * InnerChart should never get mutated during playback, which *should*
 * lead to a performance boost, I think?
 */
class InnerChart extends React.Component {

  renderMeasures() {
    const range = Range(0, this.props.numMeasures);

    return range.map((num) => {
      return (
        <svg key={`measure-${num}`} y={num * this.props.beatSpacing * 4} style={{overflow:"visible"}}>
          <line x1="0" x2={WIDTH}
            y1={this.props.beatSpacing * 0} y2={this.props.beatSpacing * 0} stroke="black" />
          <line x1="0" x2={WIDTH}
            y1={this.props.beatSpacing * 1} y2={this.props.beatSpacing * 1} stroke="grey" />
          <line x1="0" x2={WIDTH}
            y1={this.props.beatSpacing * 2} y2={this.props.beatSpacing * 2} stroke="grey" />
          <line x1="0" x2={WIDTH}
            y1={this.props.beatSpacing * 3} y2={this.props.beatSpacing * 3} stroke="grey" />
        </svg>
      );
    });
  }

  renderNotes() {
    const notes = this.props.notes;

    return notes.map((note) => {
      const beatOffset = note.beat * this.props.beatSpacing;
      const offset = (this.props.beatSpacing / 24) * note.offset;
      const y = beatOffset + offset - NOTE_HEIGHT / 2;

      const key = `note-${note.beat}-${note.offset}-${note.col}`;

      return (
        <rect key={key}
          x={note.col * LANE_WIDTH}
          y={y}
          width={LANE_WIDTH}
          height={NOTE_HEIGHT} />
      );
    });
  }

  render() {
    return (
      <g>
        {this.renderMeasures()}
        {this.renderNotes()}
      </g>
    );
  }
}

pureRender(InnerChart);

InnerChart.propTypes = {
  numMeasures: React.PropTypes.number.isRequired,
  notes: React.PropTypes.instanceOf(List).isRequired,
  beatSpacing: React.PropTypes.number.isRequired
};

class Chart extends React.Component {

  renderOffsetBar() {
    const noteName = ordinal((24 / this.props.scrollResolution) * 4);

    const beat = Math.floor(this.props.offset / 24 / 4) + 1;
    const text = `${noteName}\n ${beat}`;

    const y = this.props.offset *  (this.props.beatSpacing/24);

    return (
      <g>
        <rect x="0" y={y - NOTE_HEIGHT / 2} width={WIDTH} height={NOTE_HEIGHT}
          fill="#4A90E2"/>

        <text x={WIDTH + 10} y={-y} transform={`scale(1, -1)`}
          style={{fontFamily: 'Helvetica, sans-serif', fontSize: '16px',
                  dominantBaseline: 'central'}}>
          {text}
        </text>
      </g>
    );
  }

  render() {
    const height = this.props.numMeasures * this.props.beatSpacing * 4;
    const offset = this.props.offset * (this.props.beatSpacing / 24);

    const scrollY = -1 * (height - offset - (VIEWPORT_HEIGHT * 0.7));

    return (
      <svg width={WIDTH + 100} height={VIEWPORT_HEIGHT}>
        <g transform={`translate(0, ${scrollY})`}>
          <g transform={`translate(0, ${height}) scale(1, -1)`}>
            {this.renderOffsetBar()}
            <InnerChart 
              notes={this.props.notes}
              numMeasures={this.props.numMeasures}
              beatSpacing={this.props.beatSpacing} />
          </g>
        </g>
      </svg>
    );
  }
}

Chart.propTypes = {
  numMeasures: React.PropTypes.number.isRequired,
  notes: React.PropTypes.instanceOf(List).isRequired,

  scrollResolution: React.PropTypes.number.isRequired,
  offset: React.PropTypes.number.isRequired,
  beatSpacing: React.PropTypes.number.isRequired
};

export default Chart;
