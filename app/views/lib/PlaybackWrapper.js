import React from 'react';
import { connect } from 'react-redux';

import {
  playNote,
} from '../../actions/PlaybackActions';

import {keyCodeColMap as colMap} from '../../config/constants';

/*
 * Wrapper that handles playing notes during playback
 *
 * This uses a different system from the rest of the hotkeys in the app so that we can track the
 * down/up state of buttons instead of just firing events on trigger. This prevents things like
 * multiple events being fired for a held-down key, and in the future will allow us to adapt for
 * hold notes or other weird mechanics.
 */
const PlaybackWrapper = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired,
  },

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  },

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
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
    return this.props.children;
  }
});

export default connect()(PlaybackWrapper);
