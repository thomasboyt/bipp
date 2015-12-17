import React from 'react';
import ReactDOM from 'react-dom';
import { Iterable } from 'immutable';
import InnerChart from './InnerChart';

import ordinal from '../../../../util/ordinal';

import {ENABLE_3D_ACCEL, WIDTH, NOTE_HEIGHT} from '../constants';


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
      containerHeight: ReactDOM.findDOMNode(this).parentElement.offsetHeight
    });
  }

  renderOffsetText(y) {
    const noteName = ordinal((24 / this.props.scrollResolution) * 4);
    const beat = Math.floor(this.props.offset / 24 / 4) + 1;

    const text = `${noteName}\n ${beat}`;

    return (
      <text x={WIDTH + 10} y={y}
        style={{fontFamily: 'Helvetica, sans-serif', fontSize: '16px',
                dominantBaseline: 'central'}}>
        {text}
      </text>
    );
  }

  renderOffsetBar() {
    // TODO: Setting the `y` of this causes repaints, could a CSS translate work instead?
    const y = this.state.containerHeight * this.props.offsetPositionYPercent;

    return (
      <g>
        <rect x="0" y={y + NOTE_HEIGHT / 4} width={WIDTH} height={NOTE_HEIGHT}
          fill="#4A90E2"/>

        {this.props.showOffsetText ? this.renderOffsetText(y) : null}
      </g>
    );
  }

  render() {
    const height = this.props.numMeasures * this.props.beatSpacing * 4;
    const offset = this.props.offset * (this.props.beatSpacing / 24);

    const scrollY = -1 * (height - offset - (this.state.containerHeight * this.props.offsetPositionYPercent));

    let transform;
    if (ENABLE_3D_ACCEL) {
      transform = `translate3d(0, ${scrollY + 10}px, 0) scale3d(1, -1, 1)`;
    } else {
      transform = `translate(0, ${scrollY + 10}px) scale(1, -1)`;
    }

    let width;
    if (this.props.showOffsetText) {
      width = WIDTH + 100;
    } else {
      width = WIDTH;
    }

    return (
      <div className="chart-overflower" style={{'overflow': 'hidden', 'position': 'relative'}}>

        <svg width={width} height={this.state.containerHeight}
          className="offset-bar" style={{position: 'absolute', top: 0, left: 0}}>
          {this.renderOffsetBar()}
        </svg>

        <div style={{
          'position': 'absolute', 'top': 0, 'left': 0,
          'transform': transform, 'willChange': 'transform'
        }}>
          <svg width={width} height={height} className="chart">
            <InnerChart
              notes={this.props.notes}
              numMeasures={this.props.numMeasures}
              beatSpacing={this.props.beatSpacing}
              showMeasures={this.props.showMeasures} />
          </svg>
        </div>

      </div>
    );
  }
}

Chart.propTypes = {
  numMeasures: React.PropTypes.number.isRequired,
  notes: React.PropTypes.instanceOf(Iterable).isRequired,

  scrollResolution: React.PropTypes.number,
  offset: React.PropTypes.number.isRequired,
  beatSpacing: React.PropTypes.number.isRequired,
  offsetPositionYPercent: React.PropTypes.number.isRequired
};

export default Chart;
