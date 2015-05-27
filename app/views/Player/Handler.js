/* global YT */

import React from 'react';
import FluxComponent from 'flummox/component';

import AudioPlayback from '../lib/AudioPlayback';
import Chart from '../lib/Chart';

const DISABLE_VIDEO = document.location.hash.indexOf('novid') !== -1;

class YouTub extends React.Component {
  componentDidMount() {
    if (DISABLE_VIDEO) {
      this.props.onPlaying();
      return;
    }

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

    this._player.mute();
    this._player.playVideo();
  }

  onStateChange(evt) {
    if (evt.data === YT.PlayerState.PLAYING) {
      this.props.onPlaying();
    }
  }

  render() {
    if (DISABLE_VIDEO) {
      return <iframe className="youtub" />;
    }

    return (
      <iframe
        className="youtub"
        ref="tub"
        width="560"
        height="315"
        src="https://www.youtube.com/embed/LO-6ONFllbA?enablejsapi=1&rel=0&autoplay=0&controls=0&playsinline=1&showinfo=0&modestbranding=1"
        frameBorder="0"
        />
    );
  }
}

class Player extends React.Component {
  isLoaded() {
    return this.props.audioLoaded && this.props.songLoaded;
  }

  handleYoutubePlaying() {
    this.props.flux.getActions('playback').enterPlayback(0, this.props.bpm, this.props.songNotes);
  }

  renderChart() {
    const lastNote = this.props.songNotes.maxBy((note) => note.beat * 24 + note.offset);
    const lastOffset = lastNote.beat * 24 + lastNote.offset;
    const numMeasures = Math.ceil(lastOffset / (24 * 4));

    return (
      <Chart
        notes={this.props.playbackNotes}
        offset={this.props.playbackOffset}
        beatSpacing={120}
        numMeasures={numMeasures} />
    );
  }

  renderPlayfield() {
    return (
      <span>
        <div className="player">
          <div className="chart-container">
            {this.renderChart()}
          </div>
        </div>
        <AudioPlayback playing={this.props.inPlayback} playbackOffset={0}
          audioData={this.props.audioData} bpm={this.props.bpm} ctx={this.props.audioCtx} />
      </span>
    );
  }

  renderLoaded() {
    return (
      <span>
        {this.props.inPlayback ? this.renderPlayfield() : null}
        <YouTub onPlaying={() => this.handleYoutubePlaying()} />
        <div className="youtub-overlay" />

        <div className="info-overlay">
          <p>
            <a href="http://keribaby.pcmusic.info/">music</a> / <a href="https://www.youtube.com/watch?v=LO-6ONFllbA">video</a>
          </p>
        </div>
      </span>
    );
  }

  render() {
    return (
      <div>
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
          songLoaded: store.state.loaded
        }),

        playback: (store) => ({
          inPlayback: store.state.inPlayback,
          playbackOffset: store.state.playbackOffset,
          playbackNotes: store.state.notes
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
