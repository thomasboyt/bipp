import React from 'react';
import { Range, Iterable } from 'immutable';

import ordinal from '../../util/ordinal';
import pureRender from '../../util/pureRender';

const WIDTH = 450;
const LANE_WIDTH = 60;
const CENTER_LANE_WIDTH = 90;
const NOTE_HEIGHT = 20;

const colorMap = {
  0: 'orange',
  1: 'blue',
  2: 'orange',
  3: 'green',
  4: 'orange',
  5: 'blue',
  6: 'orange'
};

class Note extends React.Component {
  render() {
    const note = this.props.note;

    const beatOffset = note.beat * this.props.beatSpacing;
    const offset = (this.props.beatSpacing / 24) * note.offset;
    const y = beatOffset + offset - NOTE_HEIGHT / 2;

    const color = colorMap[note.col];

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

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={NOTE_HEIGHT}
        fill={color} />
    );
  }
}

pureRender(Note);

Note.propTypes = {
  note: React.PropTypes.object.isRequired,
  beatSpacing: React.PropTypes.number.isRequired
};

class Measure extends React.Component {
  render() {
    const num = this.props.num;

    return (
      <svg y={num * this.props.beatSpacing * 4} style={{overflow: 'visible'}}>
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
  }
}

pureRender(Measure);

Measure.propTypes = {
  beatSpacing: React.PropTypes.number.isRequired,
  num: React.PropTypes.number.isRequired
};

/**
 * This piece is kept separate because it only re-renders if the following props change:
 *
 * - Notes
 * - Number of measures in song
 * - Beat spacing
 *
 * This DRASTICALLY improves playback performance, as it keeps per-frame rerendering in its
 * containing <Chart />, which handles the translation that scrolls the chart based on the
 * current offset.
 */
class InnerChart extends React.Component {
  renderMeasures() {
    const range = Range(0, this.props.numMeasures);

    return range.map((num) => {
      return (
        <Measure key={`measure-${num}`} beatSpacing={this.props.beatSpacing} num={num} />
      );
    });
  }

  renderNotes() {
    const notes = this.props.notes;

    return notes.map((note) => {
      const key = `note-${note.beat}-${note.offset}-${note.col}`;

      return (
        <Note key={key} beatSpacing={this.props.beatSpacing} note={note} />
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
  notes: React.PropTypes.instanceOf(Iterable).isRequired,
  beatSpacing: React.PropTypes.number.isRequired
};


/**
 * This component contains the chart and scrolls it based on the editor's offset.
 *
 * It also renders the offset bar, since it constantly moves during playback.
 */
class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      containerHeight: 0
    };

    this._handleUpdate = this.updateHeight.bind(this);
  }

  componentDidMount() {
    this.updateHeight();

    window.addEventListener('resize', this._handleUpdate);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleUpdate);
  }

  updateHeight() {
    this.setState({
      containerHeight: React.findDOMNode(this).parentElement.offsetHeight
    });
  }

  renderOffsetBar() {
    const noteName = ordinal((24 / this.props.scrollResolution) * 4);

    const beat = Math.floor(this.props.offset / 24 / 4) + 1;
    const text = `${noteName}\n ${beat}`;

    const y = this.props.offset * (this.props.beatSpacing / 24);

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

    const scrollY = -1 * (height - offset - (this.state.containerHeight * 0.7));

    return (
      <svg width={WIDTH + 100} height={this.state.containerHeight}>
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
  notes: React.PropTypes.instanceOf(Iterable).isRequired,

  scrollResolution: React.PropTypes.number.isRequired,
  offset: React.PropTypes.number.isRequired,
  beatSpacing: React.PropTypes.number.isRequired
};

export default Chart;
