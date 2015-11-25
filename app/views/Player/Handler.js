import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import AudioPlayback from '../lib/AudioPlayback';
import Chart from '../lib/Chart';
import audioCtx from '../../audioContext';

import YouTube from './YouTube';

import {
  enterPlayback,
  resetPlayback,
  playNote,
} from '../../actions/PlaybackActions';

import {
  loadSong,
} from '../../actions/ChartActions';

import {
  loadAudio,
} from '../../actions/AudioActions';

const ENABLE_YT_PLAYBACK = document.location.hash.indexOf('enableyt') !== -1;

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

  componentWillMount() {
    const idx = this.props.params.songIdx;
    const difficulty = this.props.params.difficulty;
    this.props.dispatch(loadSong(idx, difficulty));
    this.props.dispatch(loadAudio(idx));
  }

  componentWillUnmount() {
    this.props.dispatch(resetPlayback());
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).focus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.audioLoaded && nextProps.songLoaded && !nextProps.inPlayback && !this.props.inPlayback) {
      this.props.dispatch(enterPlayback(0, this.props.bpm, this.props.songNotes));
    }
  }

  isLoaded() {
    return this.props.audioLoaded && this.props.songLoaded;
  }

  handleKeyDown(e) {
    const col = colMap[e.keyCode];

    if (col !== undefined) {
      if (!this._keysDown.has(e.keyCode)) {
        this.props.dispatch(playNote(e.timeStamp, col));
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
     this.props.dispatch(enterPlayback(0, this.props.bpm, this.props.songNotes));
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
        <YouTube onPlaying={() => this.handleYoutubePlaying()} youtubeId={this.props.songInfo.youtubeId} />
      );

    } else {
      return (
        <AudioPlayback playing={this.props.inPlayback} playbackOffsetMs={Date.now() - this.props.startTime}
          audioData={this.props.audioData} bpm={this.props.bpm} ctx={audioCtx} />
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

function select(state) {
  return {
    songNotes: state.chart.notes,
    bpm: state.chart.bpm,
    songLoaded: state.chart.loaded,
    songInfo: state.chart.songInfo,

    inPlayback: state.playback.inPlayback,
    playbackOffset: state.playback.playbackOffset,
    playbackNotes: state.playback.notes,
    judgement: state.playback.judgement,
    startTime: state.playback.startTime,

    audioLoaded: !!state.audio.audioData,
    audioData: state.audio.audioData,
  };
}

export default connect(select)(Player);
