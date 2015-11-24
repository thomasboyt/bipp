/* global YT */

import React from 'react';

class YouTube extends React.Component {
  componentDidMount() {
    const tub = this.refs.tub;

    this._player = new YT.Player(tub, {
      events: {
        onReady: (e) => this.onPlayerReady(e),
        onStateChange: (e) => this.onStateChange(e)
      }
    });
  }

  onPlayerReady(evt) {
    this._player = evt.target;

    this._player.setVolume(50);
    this._player.playVideo();

    window._player = this._player;
  }

  onStateChange(evt) {
    if (evt.data === YT.PlayerState.PLAYING) {
      this.props.onPlaying();
    }
  }

  render() {
    let url = `https://www.youtube.com/embed/${this.props.youtubeId}`;
    url += '?enablejsapi=1';
    url += '&rel=0';
    url += '&autoplay=0';
    url += '&controls=0';
    url += '&playsinline=1';
    url += '&showinfo=0';
    url += '&modestbranding=1';

    return (
      <iframe
        className="youtub"
        ref="tub"
        width="560"
        height="315"
        src={url}
        frameBorder="0"
        />
    );
  }
}

export default YouTube;
