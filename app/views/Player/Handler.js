/* global YT */

import React from 'react';
import FluxComponent from 'flummox/component';

import AudioPlayback from '../lib/AudioPlayback';
import Chart from '../lib/Chart';

const ENABLE_YT_PLAYBACK = document.location.hash.indexOf('enableyt') !== -1;

class YouTub extends React.Component {
  componentDidMount() {
    const tub = this.refs.tub.getDOMNode();

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

const colMap = {
  '83': 0,
  '68': 1,
  '70': 2,
  '32': 3,
  '74': 4,
  '75': 5,
  '76': 6
};

class Player extends React.Component {
  constructor(props) {
    super(props);

    this._keysDown = new Set();
  }

  componentDidMount() {
    React.findDOMNode(this).focus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.audioLoaded && nextProps.songLoaded && !nextProps.inPlayback && !this.props.inPlayback) {
      this.props.flux.getActions('playback').enterPlayback(0, this.props.bpm, this.props.songNotes);
    }
  }

  isLoaded() {
    return this.props.audioLoaded && this.props.songLoaded;
  }

  handleKeyDown(e) {
    const col = colMap[e.keyCode];

    if (col !== undefined) {
      if (!this._keysDown.has(e.keyCode)) {
        this.props.flux.getActions('playback').playNote(e.timeStamp, col);
        this._keysDown.add(e.keyCode);
      }
    }
  }

  handleKeyUp(e) {
    if (this._keysDown.has(e.keyCode)) {
      this._keysDown.delete(e.keyCode);
    }
  }

  handleYoutubePlaying() {
    if (!this.props.inPlayback) {
      this.props.flux.getActions('playback').enterPlayback(0, this.props.bpm, this.props.songNotes);
    }
  }

  renderChart() {
    const lastNote = this.props.songNotes.maxBy((note) => note.beat * 24 + note.offset);
    const lastOffset = lastNote.beat * 24 + lastNote.offset;
    const numMeasures = Math.ceil(lastOffset / (24 * 4));

    return (
      <Chart
        notes={this.props.playbackNotes}
        offset={this.props.playbackOffset}
        offsetPositionYPercent={0.9}
        beatSpacing={160}
        numMeasures={numMeasures} />
    );
  }

  renderJudgement() {
    return (
      <div className="judge">
        {this.props.judgement}
      </div>
    );
  }

  renderAudio() {
    if (ENABLE_YT_PLAYBACK) {
      return (
        <YouTub onPlaying={() => this.handleYoutubePlaying()} youtubeId={this.props.songInfo.get('youtubeId')} />
      );
    } else {
      return (
        <AudioPlayback playing={this.props.inPlayback} playbackOffset={0}
          audioData={this.props.audioData} bpm={this.props.bpm} ctx={this.props.audioCtx} />
      );
    }
  }

  renderLoaded() {
    return (
      <div className="playfield">
        {this.props.inPlayback ? this.renderChart() : null}
        {this.props.inPlayback ? this.renderJudgement() : null}
        {this.renderAudio()}

        <div className="youtub-overlay" />

        <div className="info-overlay">
          <p>
            <a href="http://keribaby.pcmusic.info/">music</a> / <a href="https://www.youtube.com/watch?v=LO-6ONFllbA">video</a>
          </p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="player-container" tabIndex="1" onKeyDown={(e) => this.handleKeyDown(e)} onKeyUp={(e) => this.handleKeyUp(e)}>
        {this.isLoaded() ? this.renderLoaded() : null}
      </div>
    );
  }
}

class PlayerOuter extends React.Component {
  componentWillMount() {
    const idx = this.props.params.songIdx;
    this.props.flux.getActions('song').loadSong(idx);
    this.props.flux.getActions('audio').loadAudio(idx);
  }

  componentWillUnmount() {
    this.props.flux.getStore('playback').reset();
  }

  render() {
    return (
      <FluxComponent flux={this.props.flux} connectToStores={{
        song: (store) => ({
          songNotes: store.state.notes,
          bpm: store.state.bpm,
          songLoaded: store.state.loaded,
          songInfo: store.state.songInfo
        }),

        playback: (store) => ({
          inPlayback: store.state.inPlayback,
          playbackOffset: store.state.playbackOffset,
          playbackNotes: store.state.notes,
          judgement: store.state.judgement
        }),

        audio: (store) => ({
          audioLoaded: !!store.state.audioData,
          audioData: store.state.audioData,
          audioCtx: store.state.ctx
        })
      }}>
        <Player />
      </FluxComponent>
    );
  }
}

export default PlayerOuter;
