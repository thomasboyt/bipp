import React from 'react';
import {HotKeys} from 'react-hotkeys';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';

import {Link} from 'react-router';

import _ from 'lodash';

import songs from '../../config/songs';


const SONG_TRANSITION_MS = 300;

const SongList = React.createClass({
  getInitialState() {
    return {
      selectedSongIdx: 0,
      direction: null,
    };
  },

  getKeyMap() {
    return {
      'prev': 'left',
      'next': 'right',
    };
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
    };
  },

  renderDifficulties(song, idx) {
    const difficulties = _.map(_.keys(song.data), (key) => {
      return (
        <li key={key}>
          {key}{': '}
          <Link to={`/play/${idx}/${key}`}>Play</Link>{' / '}
          <Link to={`/edit/${idx}/${key}`}>Edit</Link>
        </li>
      );
    });

    return (
      <ul>
        {difficulties}
      </ul>
    );
  },

  renderItem(song, idx) {
    return (
      <div key={idx} className="song-item">
        {song.title}<br/>{song.artist}
      </div>
    );
  },

  renderCurrentItem() {
    const idx = this.state.selectedSongIdx;
    const song = songs[idx];
    return this.renderItem(song, idx);
  },

  render() {
    const className = classNames('song-list', {
      'backward': this.state.direction === 'backward',
    });

    return (
      <HotKeys handlers={this.getHandlers()} keyMap={this.getKeyMap()}
        className="song-list-container">
        <ReactCSSTransitionGroup className={className}
          transitionName="song-item"
          transitionEnterTimeout={SONG_TRANSITION_MS}
          transitionLeaveTimeout={SONG_TRANSITION_MS}>
          {this.renderCurrentItem()}
        </ReactCSSTransitionGroup>
      </HotKeys>
    );
  }
});

export default SongList;
