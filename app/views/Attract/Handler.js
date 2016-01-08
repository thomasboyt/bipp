import React from 'react';
import ReactDOM from 'react-dom';
import {HotKeys} from 'react-hotkeys';
import {History} from 'react-router';

import GameWrapper from '../lib/GameWrapper';

const Attract = React.createClass({
  mixins: [
    History,
  ],

  componentDidMount() {
    ReactDOM.findDOMNode(this).focus();
  },

  getHandlers() {
    return {
      advance: (e) => {
        e.preventDefault();

        this.history.pushState(null, '/song-select');
      }
    };
  },

  getKeyMap() {
    return {
      'advance': ['space', 'enter']
    };
  },

  render() {
    return (
      <GameWrapper>
        <HotKeys handlers={this.getHandlers()} keyMap={this.getKeyMap()}
          className="attract-container">
          <div className="attract">
            <h1>Undertune</h1>
            <p>press space</p>
          </div>
        </HotKeys>
      </GameWrapper>
    );
  }
});

export default Attract;
