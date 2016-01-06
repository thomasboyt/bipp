import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {HotKeys} from 'react-hotkeys';
import {History} from 'react-router';
import {connect} from 'react-redux';
import classNames from 'classnames';

import {loadAudio} from '../../actions/AudioActions';

import audioCtx from '../../audioContext';
import AudioPlayback from '../lib/AudioPlayback';
import Arrow from './Arrow';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


const SONG_TRANSITION_MS = 300;

const SongSelect = React.createClass({
  mixins: [
    History,
  ],

  getInitialState() {
    return {
      selectedSongIdx: 0,
      selectedDifficultyIdx: 0,
      direction: null,
    };
  },

  componentWillMount() {
    if (!this.getAudioData()) {
      this.props.dispatch(loadAudio(this.getCurrentSong()));
    }
  },

  componentDidMount() {
    ReactDOM.findDOMNode(this).focus();
  },

  getCurrentSong() {
    return this.props.songs.get(this.state.selectedSongIdx);
  },

  getAudioData() {
    return this.props.audioData.get(this.getCurrentSong().slug);
  },

  setSong(idx, direction) {
    if (this.state.inTransition || idx < 0 || idx >= this.props.songs.size) {
      return;
    }

    this.setState({
      direction: direction,
      selectedSongIdx: idx,
      inTransition: true,
    }, () => {
      if (!this.getAudioData()) {
        this.props.dispatch(loadAudio(this.getCurrentSong()));
      }
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
        this.setSong(idx, 'backward');
      },

      next: (e) => {
        e.preventDefault();

        const idx = this.state.selectedSongIdx + 1;
        this.setSong(idx, 'forward');
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

        this.history.pushState(null, `/play/${song.slug}/${difficulty}`);
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

  renderAudio() {
    const audioData = this.getAudioData();

    if (audioData) {
      return (
        <AudioPlayback playing audioData={audioData} ctx={audioCtx} />
      );
    }
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
          {this.state.selectedSongIdx < this.props.songs.size - 1 &&
            <Arrow dir="right" height={60} width={60} />}
        </div>

        {this.renderAudio()}

      </HotKeys>
    );
  }
});

function select(state) {
  return {
    songs: state.songs.songs.filter((song) => !song.hidden).toList(),

    audioData: state.audio.audioData,
 };
}

export default connect(select)(SongSelect);
