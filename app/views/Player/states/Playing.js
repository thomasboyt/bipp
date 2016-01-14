import React from 'react';
import { connect } from 'react-redux';

import AudioPlayback from '../../lib/AudioPlayback';
import Chart from '../../lib/Chart';
import PlaybackWrapper from '../../lib/PlaybackWrapper';
import audioCtx from '../../../audioContext';

import YouTube from '../YouTube';
import LifeBar from '../LifeBar';

import {Song} from '../../../records';

import {
  ENABLE_YT_PLAYBACK,
} from '../../../config/flags';

import {
  playerColors,
} from '../../../config/constants';

const Playing = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,

    bpm: React.PropTypes.number.isRequired,
    songNotes: React.PropTypes.object.isRequired,
    song: React.PropTypes.instanceOf(Song).isRequired,

    audioData: React.PropTypes.object.isRequired,

    playbackNotes: React.PropTypes.object.isRequired,
    playbackOffset: React.PropTypes.number.isRequired,
    judgement: React.PropTypes.object,
    beatSpacing: React.PropTypes.number.isRequired,
  },

  renderChart() {
    const lastOffset = this.props.songNotes.maxBy((note) => note.totalOffset).totalOffset;
    const numMeasures = Math.ceil(lastOffset / (24 * 4));

    return (
      <Chart
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
        <YouTube onPlaying={() => this.handleYoutubePlaying()} youtubeId={this.props.song.youtubeId} />
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
    if (!this.props.judgement) {
      return (
        <div className="judge" />
      );
    }

    const {label, className} = this.props.judgement;

    return (
      <div className={`judge judgement-${className}`}>
        {label}
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
      <PlaybackWrapper>
        <div className="player-container">
          <div className="playfield">
            {this.renderChart()}
            {this.renderJudgement()}
            {this.renderLifeBar()}
            {this.renderAudio()}
          </div>

          <div className="character">
            <img src={this.props.song.img} />
          </div>
        </div>
      </PlaybackWrapper>
    );
  },
});

function select(state) {
  return {
    bpm: state.chart.bpm,
    songNotes: state.chart.notes,
    song: state.chart.song,

    playbackNotes: state.playback.notes,
    playbackOffset: state.playback.playbackOffset,
    judgement: state.playback.judgement,
    beatSpacing: state.playback.beatSpacing,
    hp: state.playback.hp,

    fps: state.fps,
  };
}

export default connect(select)(Playing);
