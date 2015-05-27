import React from 'react';
import {Link} from 'react-router';

const songs = require('../../config/songs');

class SongList extends React.Component {
  renderSongs() {
    return songs.map((song, idx) => (
      <li key={idx}>
        {song.title} -&nbsp;
        <Link to="Player" params={{songIdx: idx}}>Play</Link> /&nbsp;
        <Link to="Editor" params={{songIdx: idx}}>Edit</Link>
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
