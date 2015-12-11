import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';

import songs from '../../config/songs';

class SongList extends React.Component {
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
