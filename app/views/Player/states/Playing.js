import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import AudioPlayback from '../../lib/AudioPlayback';
import SVGChart from '../../lib/Charts/SVGChart';
import CanvasChart from '../../lib/Charts/CanvasChart';
import audioCtx from '../../../audioContext';

import YouTube from '../YouTube';
import LifeBar from '../LifeBar';

import {
  playNote,
} from '../../../actions/PlaybackActions';

import {
  ENABLE_YT_PLAYBACK,
  ENABLE_CANVAS_PLAYBACK,
} from '../../../config/flags';

import {
  playerColors,
} from '../../../config/constants';

const colMap = {
  '83': 0,
  '68': 1,
  '70': 2,
  '32': 3,
  '74': 4,
  '75': 5,
  '76': 6
};

const Playing = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,

    bpm: React.PropTypes.number.isRequired,
    songNotes: React.PropTypes.object.isRequired,
    songInfo: React.PropTypes.object.isRequired,

    audioData: React.PropTypes.object.isRequired,

    playbackNotes: React.PropTypes.object.isRequired,
    playbackOffset: React.PropTypes.number.isRequired,
    judgement: React.PropTypes.node,
    beatSpacing: React.PropTypes.number.isRequired,
  },

  _keysDown: new Set(),

  componentDidMount() {
    ReactDOM.findDOMNode(this).focus();
  },

  handleKeyDown(e) {
    const col = colMap[e.keyCode];

    if (col !== undefined) {
      if (!this._keysDown.has(e.keyCode)) {
        this.props.dispatch(playNote(Date.now(), col));
        this._keysDown.add(e.keyCode);
      }
    }
  },

  handleKeyUp(e) {
    if (this._keysDown.has(e.keyCode)) {
      this._keysDown.delete(e.keyCode);
    }
  },

  renderChart() {
    const lastOffset = this.props.songNotes.maxBy((note) => note.totalOffset).totalOffset;
    const numMeasures = Math.ceil(lastOffset / (24 * 4));

    const ChartComponent = ENABLE_CANVAS_PLAYBACK ? CanvasChart : SVGChart;

    return (
      <ChartComponent
        notes={this.props.playbackNotes}
        offset={this.props.playbackOffset}
        offsetPositionYPercent={0.9}
        beatSpacing={this.props.beatSpacing}
        numMeasures={numMeasures}
        fps={this.props.fps}
        colors={playerColors} />
    );
  },

  renderAudio() {
    // TODO: Move me to the wrapper container, so Youtube starts loading ASAP...
    if (ENABLE_YT_PLAYBACK) {
      return (
        <YouTube onPlaying={() => this.handleYoutubePlaying()} youtubeId={this.props.songInfo.youtubeId} />
      );

    } else {
      return (
        <AudioPlayback playing
          playbackOffset={this.props.playbackOffset}
          audioData={this.props.audioData} bpm={this.props.bpm} ctx={audioCtx} />
      );
    }
  },

  renderJudgement() {
    return (
      <div className="judge">
        {this.props.judgement}
      </div>
    );
  },

  renderLifeBar() {
    // TODO: import width from chart constants
    return (
      <LifeBar width={450} height={30} hp={this.props.hp} />
    );
  },

  render() {
    return (
      <div className="player-container in-game" tabIndex="-1"
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}>
        <div className="playfield">
          {this.renderChart()}
          {this.renderJudgement()}
          {this.renderLifeBar()}
          {this.renderAudio()}

          <div className="youtub-overlay" />

          <div className="info-overlay">
            <p />
          </div>
        </div>
      </div>
    );
  },
});

function select(state) {
  return {
    bpm: state.chart.bpm,
    songNotes: state.chart.notes,
    songInfo: state.chart.songInfo,

    playbackNotes: state.playback.notes,
    playbackOffset: state.playback.playbackOffset,
    judgement: state.playback.judgement,
    beatSpacing: state.playback.beatSpacing,
    hp: state.playback.hp,

    fps: state.fps,
  };
}

export default connect(select)(Playing);
