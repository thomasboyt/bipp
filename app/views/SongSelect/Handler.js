import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {History, Link} from 'react-router';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import classNames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';

import {loadAudio} from '../../actions/AudioActions';

import audioCtx from '../../audioContext';

import AudioPlayback from '../lib/AudioPlayback';
import Arrow from './Arrow';
import GameWrapper from '../lib/GameWrapper';
import HotKeys from '../lib/GlobalHotKeys';

import {Song} from '../../records';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


const SONG_TRANSITION_MS = 300;

const SongSelect = React.createClass({
  propTypes: {
    songs: ImmutablePropTypes.listOf(Song).isRequired,
    audioData: ImmutablePropTypes.map.isRequired,
  },

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

  handlePrevSong() {
    const idx = this.state.selectedSongIdx - 1;
    this.setSong(idx, 'backward');
  },

  handleNextSong() {
    const idx = this.state.selectedSongIdx + 1;
    this.setSong(idx, 'forward');
  },

  getHandlers() {
    return {
      prev: (e) => {
        e.preventDefault();

        this.handlePrevSong();
      },

      next: (e) => {
        e.preventDefault();
        this.handleNextSong();
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

  handleDifficultyHover(idx) {
    this.setState({
      selectedDifficultyIdx: idx
    });
  },

  renderItem(song, idx) {
    const difficulties = Object.keys(song.data).map((difficulty, idx) => {
      const selected = this.state.selectedDifficultyIdx === idx;

      return (
        <li key={difficulty} onMouseOver={() => this.handleDifficultyHover(idx)}>
          <Link to={`/play/${song.slug}/${difficulty}`}>
            {selected && <Arrow height={16} width={16} dir="right" />}
            {capitalize(difficulty)}
          </Link>
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
      <GameWrapper>
        <HotKeys handlers={this.getHandlers()} keyMap={this.getKeyMap()}>

          <div className="song-list-container">
            <div className="arrow-container">
              {this.state.selectedSongIdx > 0 &&
                <Arrow onClick={this.handlePrevSong} dir="left" height={60} width={60} />}
            </div>

            <ReactCSSTransitionGroup component="div" className={className}
              transitionName="song-item"
              transitionEnterTimeout={SONG_TRANSITION_MS}
              transitionLeaveTimeout={SONG_TRANSITION_MS}>
              {this.renderCurrentItem()}
            </ReactCSSTransitionGroup>

            <div className="arrow-container">
              {this.state.selectedSongIdx < this.props.songs.size - 1 &&
                <Arrow onClick={this.handleNextSong} dir="right" height={60} width={60} />}
            </div>

            {this.renderAudio()}
          </div>

        </HotKeys>
      </GameWrapper>
    );
  }
});

// filter songs down to only visible ones
//
// this uses reselect instead of just calculating inside the select() function below because the
// select() function is called on every single redux update, and the result was being picked up as
// a "changed" (by object identity) prop, causing this component to re-render unnecessarily
//
// reselect memoizes the result, so the repeated select() calls always get the same list, and thus
// the props don't change :)
const selectSongs = createSelector(
  (state) => state.songs.songs,
  (allSongs) => {
    const songs = allSongs.filter((song) => !song.hidden).toList();

    return songs;
  }
);

function select(state) {
  return {
    songs: selectSongs(state),
    audioData: state.audio.audioData,
  };
}

export default connect(select)(SongSelect);
