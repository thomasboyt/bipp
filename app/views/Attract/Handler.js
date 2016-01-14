import React from 'react';
import HotKeys from '../lib/GlobalHotKeys';
import {History} from 'react-router';

import GameWrapper from '../lib/GameWrapper';

const Attract = React.createClass({
  mixins: [
    History,
  ],

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
        <HotKeys handlers={this.getHandlers()} keyMap={this.getKeyMap()}>
          <div className="attract-container">
            <div className="attract">
              <h1>Undertune</h1>
              <p>press space</p>
            </div>
          </div>
        </HotKeys>
      </GameWrapper>
    );
  }
});

export default Attract;
