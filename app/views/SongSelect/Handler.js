import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {HotKeys} from 'react-hotkeys';
import {History} from 'react-router';

import classNames from 'classnames';

import Arrow from './Arrow';

import songs from '../../config/songs';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


const SONG_TRANSITION_MS = 300;

const SongSelect = React.createClass({
  mixins: [
    History,
  ],

  componentDidMount() {
    ReactDOM.findDOMNode(this).focus();
  },

  getInitialState() {
    return {
      selectedSongIdx: 0,
      selectedDifficultyIdx: 0,
      direction: null,
    };
  },

  getCurrentSong() {
    return songs[this.state.selectedSongIdx];
  },

  setTransition(idx, direction) {
    if (this.state.inTransition || idx < 0 || idx >= songs.length) {
      return;
    }

    this.setState({
      direction: direction,
      selectedSongIdx: idx,
      inTransition: true,
    });

    setTimeout(() => {
      this.setState({
        inTransition: false
      });
    }, SONG_TRANSITION_MS);
  },

  setDifficulty(idx) {
    const currentSong = this.getCurrentSong();
    const numDifficulties = Object.keys(currentSong.data).length;

    if (idx < 0 || idx >= numDifficulties) {
      return;
    }

    this.setState({
      selectedDifficultyIdx: idx,
    });
  },

  getKeyMap() {
    return {
      'prev': ['s', 'left'],
      'next': ['l', 'right'],
      'prevDifficulty': ['k', 'up'],
      'nextDifficulty': ['j', 'down'],
      'select': ['space', 'enter'],
    };
  },

  getHandlers() {
    return {
      prev: (e) => {
        e.preventDefault();

        const idx = this.state.selectedSongIdx - 1;
        this.setTransition(idx, 'backward');
      },

      next: (e) => {
        e.preventDefault();

        const idx = this.state.selectedSongIdx + 1;
        this.setTransition(idx, 'forward');
      },

      prevDifficulty: (e) => {
        e.preventDefault();

        this.setDifficulty(this.state.selectedDifficultyIdx - 1);
      },

      nextDifficulty: (e) => {
        e.preventDefault();

        this.setDifficulty(this.state.selectedDifficultyIdx + 1);
      },

      select: (e) => {
        e.preventDefault();

        const song = this.getCurrentSong();
        const difficulty = Object.keys(song.data)[this.state.selectedDifficultyIdx];

        this.history.pushState(null, `/play/${this.state.selectedSongIdx}/${difficulty}`);
      }
    };
  },

  renderItem(song, idx) {
    const difficulties = Object.keys(song.data).map((key, idx) => {
      const selected = this.state.selectedDifficultyIdx === idx;

      return (
        <li key={key}>
          {selected && <Arrow height={16} width={16} dir="right" />}
          {capitalize(key)}
        </li>
      );
    });

    return (
      <div key={idx} className="song-item">
        {song.title}

        <img src={song.img} />

        <ul className="difficulties">
          {difficulties}
        </ul>
      </div>
    );
  },

  renderCurrentItem() {
    const idx = this.state.selectedSongIdx;
    const song = this.getCurrentSong();
    return this.renderItem(song, idx);
  },

  render() {
    const className = classNames('song-list', {
      'backward': this.state.direction === 'backward',
    });

    return (
      <HotKeys handlers={this.getHandlers()} keyMap={this.getKeyMap()}
        className="song-list-container in-game">

        <div className="arrow-container">
          {this.state.selectedSongIdx > 0 &&
            <Arrow dir="left" height={60} width={60} />}
        </div>

        <ReactCSSTransitionGroup component="div" className={className}
          transitionName="song-item"
          transitionEnterTimeout={SONG_TRANSITION_MS}
          transitionLeaveTimeout={SONG_TRANSITION_MS}>
          {this.renderCurrentItem()}
        </ReactCSSTransitionGroup>

        <div className="arrow-container">
          {this.state.selectedSongIdx < songs.length - 1 &&
            <Arrow dir="right" height={60} width={60} />}
        </div>

      </HotKeys>
    );
  }
});

export default SongSelect;
