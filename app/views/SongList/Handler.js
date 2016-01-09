import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import {connect} from 'react-redux';

const SongList = React.createClass({
  renderDifficulties(song) {
    const difficulties = _.map(_.keys(song.data), (key) => {
      return (
        <li key={key}>
          {key}{': '}
          <Link to={`/play/${song.slug}/${key}`}>Play</Link>{' / '}
          <Link to={`/edit/${song.slug}/${key}`}>Edit</Link>
        </li>
      );
    });

    return (
      <ul>
        {difficulties}
      </ul>
    );
  },

  renderSongs() {
    return this.props.songs.map((song, key) => (
      <li key={key}>
        {song.title} - {song.artist}
        {this.renderDifficulties(song)}
      </li>
    )).toList();
  },

  render() {
    return (
      <div>
        <ul>
          {this.renderSongs()}
        </ul>
      </div>
    );
  }
});

function select(state) {
  return {
    songs: state.songs.songs
 };
}

export default connect(select)(SongList);
