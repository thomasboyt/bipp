import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

const songs = require('../../config/songs');

class SongList extends React.Component {
  renderDifficulties(song, idx) {
    const difficulties = _.map(_.keys(song.data), (key) => {
      return (
        <li key={key}>
          {key}{': '}
          <Link to="Player" params={{songIdx: idx, difficulty: key}}>Play</Link>{' / '}
          <Link to="Editor" params={{songIdx: idx, difficulty: key}}>Edit</Link>
        </li>
      );
    });

    return (
      <ul>
        {difficulties}
      </ul>
    );
  }

  renderSongs() {
    return songs.map((song, idx) => (
      <li key={idx}>
        {song.title} - {song.artist}
        {this.renderDifficulties(song, idx)}
      </li>
    ));
  }

  render() {
    return (
      <div>
        <ul>
          {this.renderSongs()}
        </ul>
      </div>
    );
  }
}

export default SongList;
