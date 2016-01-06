import React from 'react';
import ReactDOM from 'react-dom';
import {HotKeys} from 'react-hotkeys';
import {History} from 'react-router';

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
      <HotKeys handlers={this.getHandlers()} keyMap={this.getKeyMap()}
        className="attract-container in-game">
        <div className="attract">
          <h1>Bipp</h1>
          <p>press space</p>
        </div>
      </HotKeys>
    );
  }
});

export default Attract;
