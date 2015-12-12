import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import {HotKeys} from 'react-hotkeys';

import {
  enterPlayback,
} from '../../../actions/PlaybackActions';

const Loaded = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,

    bpm: React.PropTypes.number.isRequired,
    songNotes: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      beatSpacing: 160,
    };
  },

  componentDidMount() {
    ReactDOM.findDOMNode(this).focus();
  },

  getHandlers() {
    return {
      speedUp: () => {
        this.setState({
          beatSpacing: this.state.beatSpacing - 80
        });
      },

      speedDown: () => {
        this.setState({
          beatSpacing: this.state.beatSpacing + 80
        });
      },

      start: () => {
        this.props.dispatch(enterPlayback(0, this.props.bpm, this.props.songNotes, this.state.beatSpacing));
      },
    };
  },

  getKeyMap() {
    return {
      start: 'space',
      speedUp: '-',
      speedDown: '=',
    };
  },

  render() {
    const spd = this.state.beatSpacing / 160;

    return (
      <HotKeys handlers={this.getHandlers()} keyMap={this.getKeyMap()}
        className="player-container">
        <div className="help-text-container">
          <p>
            Press space to play
          </p>
          <p>
            Speed: {spd}x<br/>
            (use -/= keys to adjust)
          </p>
        </div>
      </HotKeys>
    );
  }
});

function select(state) {
  return {
    bpm: state.chart.bpm,
    songNotes: state.chart.notes,
  };
}

export default connect(select)(Loaded);
