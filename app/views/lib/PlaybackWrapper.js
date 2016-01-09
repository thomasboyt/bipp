import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import {
  playNote,
} from '../../actions/PlaybackActions';

// Map keyCodes to columns
export const colMap = {
  '83': 0,
  '68': 1,
  '70': 2,
  '32': 3,
  '74': 4,
  '75': 5,
  '76': 6
};

/*
 * Wrapper that handles playing notes during playback
 */
const PlaybackWrapper = React.createClass({
  componentDidMount() {
    ReactDOM.findDOMNode(this).focus();
  },

  _keysDown: new Set(),

  handleKeyDown(e) {
    const col = colMap[e.keyCode];

    if (col !== undefined) {
      if (!this._keysDown.has(e.keyCode)) {
        this.props.dispatch(playNote(Date.now(), col));
        this._keysDown.add(e.keyCode);

        return false;
      }
    }
  },

  handleKeyUp(e) {
    if (this._keysDown.has(e.keyCode)) {
      this._keysDown.delete(e.keyCode);
      return false;
    }
  },

  render() {
    return (
      <div onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} tabIndex="-1"
        {...this.props} >
        {this.props.children}
      </div>
    );
  }
});

export default connect()(PlaybackWrapper);
