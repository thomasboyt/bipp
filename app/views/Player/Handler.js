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

const ENABLE_YT_PLAYBACK = document.location.search.indexOf('enableyt') !== -1;

const colMap = {
  '83': 0,
  '68': 1,
  '70': 2,
  '32': 3,
  '74': 4,
  '75': 5,
  '76': 6
};

const STATE_LOADING = 'loading';
const STATE_LOADED = 'loaded';
const STATE_PLAYING = 'playing';

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      beatSpacing: 160,
    };

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

  getState() {
    if (this.props.inPlayback) {
      return STATE_PLAYING;
    } else if (this.props.audioLoaded && this.props.songLoaded) {
      return STATE_LOADED;
    } else {
      return STATE_LOADING;
    }
  }

  handleKeyDown(e) {
    if (this.getState() === STATE_PLAYING) {
      const col = colMap[e.keyCode];

      if (col !== undefined) {
        if (!this._keysDown.has(e.keyCode)) {
          this.props.dispatch(playNote(e.timeStamp, col));
          this._keysDown.add(e.keyCode);
        }
      }

    } else if (this.getState() === STATE_LOADED) {
      // TODO: Use react-hotkeys for this

      if (e.keyCode === 32) {
        // space
        this.props.dispatch(enterPlayback(0, this.props.bpm, this.props.songNotes));

      } else if (e.keyCode === 189) {
        // -
        this.setState({
          beatSpacing: this.state.beatSpacing - 80
        });

      } else if (e.keyCode === 187) {
        // =
        this.setState({
          beatSpacing: this.state.beatSpacing + 80
        });
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
        beatSpacing={this.state.beatSpacing}
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
        <AudioPlayback playing={this.props.inPlayback}
          playbackOffset={this.props.playbackOffset}
          audioData={this.props.audioData} bpm={this.props.bpm} ctx={audioCtx} />
      );
    }
  }

  renderPlaying() {
    return (
      <div className="playfield">
        {this.props.inPlayback ? this.renderChart() : null}
        {this.props.inPlayback ? this.renderJudgement() : null}
        {this.renderAudio()}

        <div className="youtub-overlay" />

        <div className="info-overlay">
          <p />
        </div>
      </div>
    );
  }

  renderLoaded() {
    const spd = this.state.beatSpacing / 160;
    return (
      <div className="help-text-container">
        <p>
          Press space to play
        </p>
        <p>
          Speed: {spd}x<br/>
          (use -/= keys to adjust)
        </p>
      </div>
    );
  }

  renderLoading() {
    return (
      <div className="help-text-container">
        <p>
          Loading...
        </p>
      </div>
    );
  }

  render() {
    let outlet;

    if (this.getState() === STATE_LOADING) {
      outlet = this.renderLoading();
    } else if (this.getState() === STATE_LOADED) {
      outlet = this.renderLoaded();
    } else if (this.getState() === STATE_PLAYING) {
      outlet = this.renderPlaying();
    }

    return (
      <div className="player-container" tabIndex="1"
        onKeyDown={(e) => this.handleKeyDown(e)}
        onKeyUp={(e) => this.handleKeyUp(e)}>
        {outlet}
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

    audioLoaded: !!state.audio.audioData,
    audioData: state.audio.audioData,
  };
}

export default connect(select)(Player);
