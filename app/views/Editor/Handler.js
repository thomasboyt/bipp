import React from 'react';
import HotKeys from '../lib/GlobalHotKeys';
import { connect } from 'react-redux';

import AudioPlayback from '../lib/AudioPlayback';
import Chart from '../lib/Chart';
import PlaybackWrapper from '../lib/PlaybackWrapper';

import EditorControls from './components/EditorControls';

import audioCtx from '../../audioContext';

import {
  resetPlayback,
  enterPlayback,
  exitPlayback,
} from '../../actions/PlaybackActions';

import {
  toggleNote,
  loadSong,
} from '../../actions/ChartActions';

import {
  loadAudio,
} from '../../actions/AudioActions';

import {
  editorColors,
  keyColMap as colMap,
} from '../../config/constants';

const resolutions = [24, 12, 8, 6, 4, 3];

const findSmallestResIdx = function(offset) {
  for (let i = 0; i < resolutions.length; i++) {
    if (offset % resolutions[i] === 0) {
      return i;
    }
  }
};

const Editor = React.createClass({
  getInitialState() {
    return {
      offset: 0,
      scrollResolutionIdx: 0,
      beatSpacing: 80
    };
  },

  componentWillMount() {
    const difficulty = this.props.params.difficulty;
    this.props.dispatch(loadSong(this.props.song, difficulty));

    if (!this.props.audioData) {
      this.props.dispatch(loadAudio(this.props.song));
    }
  },

  componentWillUnmount() {
    this.props.dispatch(resetPlayback());
  },

  getKeyMap() {
    if (this.props.inPlayback) {
      return {
        'exitPlayback': ['p', 'esc'],
      };

    } else {
      return {
        'scrollUp': ['up', 'shift+k'],
        'scrollDown': ['down', 'shift+j'],
        'measureUp': 'pageup',
        'measureDown': 'pagedown',
        'jumpToStart': 'home',
        'jumpToEnd': 'end',
        'zoomOut': '-',
        'zoomIn': '=',
        'scrollResDown': 'left',
        'scrollResUp': 'right',
        'enterPlayback': 'p',
        'toggleNote': ['s', 'd', 'f', 'space', 'j', 'k', 'l']
      };
    }
  },

  setOffset(nextOffset) {
    if (nextOffset <= this.getMaxOffset() && nextOffset >= 0) {
      this.setState({
        offset: nextOffset
      });
    }
  },

  getHandlers() {
    return {
      scrollUp: (e) => {
        e.preventDefault();

        this.setOffset(this.state.offset + this.getScrollResolution());
      },

      scrollDown: (e) => {
        e.preventDefault();

        this.setOffset(this.state.offset - this.getScrollResolution());
      },

      measureUp: (e) => {
        e.preventDefault();

        this.setOffset(this.state.offset + (24 * 4));
      },

      measureDown: (e) => {
        e.preventDefault();

        this.setOffset(this.state.offset - (24 * 4));
      },

      jumpToStart: (e) => {
        e.preventDefault();

        this.setOffset(0);
      },

      jumpToEnd: (e) => {
        e.preventDefault();

        const lastOffset = this.getLastNoteOffset();

        if (lastOffset % this.getScrollResolution !== 0) {
          this.setState({
            scrollResolutionIdx: findSmallestResIdx(lastOffset)
          });
        }

        this.setState({
          offset: lastOffset
        });
      },

      zoomOut: () => {
        this.setState({
          beatSpacing: this.state.beatSpacing - 40
        });
      },

      zoomIn: () => {
        this.setState({
          beatSpacing: this.state.beatSpacing + 40
        });
      },

      scrollResUp: () => {
        this.handleUpdateScrollResolution(true);
      },

      scrollResDown: () => {
        this.handleUpdateScrollResolution(false);
      },

      enterPlayback: () => {
        this.props.dispatch(enterPlayback(this.state.offset, this.props.bpm, this.getNotes()));
      },

      exitPlayback: () => {
        this.props.dispatch(exitPlayback());
      },

      toggleNote: (e, key) => {
        const col = colMap[key];

        this.props.dispatch(toggleNote(this.state.offset, col));
      },
    };
  },

  getOffset() {
    if (this.props.inPlayback) {
      return this.props.playbackOffset;
    } else {
      return this.state.offset;
    }
  },

  getNotes() {
    if (this.props.inPlayback) {
      return this.props.playbackNotes;
    } else {
      return this.props.songNotes;
    }
  },

  getScrollResolution() {
    return resolutions[this.state.scrollResolutionIdx];
  },

  getNumMeasures() {
    const numBeats = Math.ceil(this.props.bpm / (60 / this.props.audioData.duration));
    return Math.ceil(numBeats / 4);
  },

  getMaxOffset() {
    return this.getNumMeasures() * 4 * 24 - 24;
  },

  getLastNoteOffset() {
    return this.props.songNotes.maxBy((note) => note.totalOffset).totalOffset;
  },

  handleUpdateScrollResolution(increase) {
    const inc = increase ? 1 : -1;

    const nextResIdx = this.state.scrollResolutionIdx + inc;

    if (nextResIdx < 0 || nextResIdx >= resolutions.length) {
      return;
    }

    const nextRes = resolutions[nextResIdx];

    // Snap to nearest note in resolution if resolution changes
    // i.e. if you're on an 8th and drop 8ths to 4ths, snap to previous 4th
    //      if you're on an 8th and drop 16ths to 8ths, stay on the same

    let nextOffset = this.state.offset - (this.state.offset % nextRes);

    this.setState({
      scrollResolutionIdx: nextResIdx,
      offset: nextOffset
    });
  },

  renderChart() {
    const chart = (
      <Chart
        notes={this.getNotes()}
        offset={this.getOffset()}
        beatSpacing={this.state.beatSpacing}

        showMeasures
        showOffsetText
        scrollResolution={this.getScrollResolution()}
        numMeasures={this.getNumMeasures()}
        offsetPositionYPercent={0.7}
        fps={this.props.fps}
        colors={editorColors} />
    );

    if (this.props.inPlayback) {
      return (
        <PlaybackWrapper>
          {chart}
        </PlaybackWrapper>
      );
    }

    return chart;
  },

  renderLoaded() {
    return (
      <HotKeys handlers={this.getHandlers()} keyMap={this.getKeyMap()}>
        <div className="editor">
          <div className="chart-container">
            {this.renderChart()}
          </div>

          <EditorControls flux={this.props.flux} playbackRate={this.props.playbackRate} />

          <AudioPlayback playing={this.props.inPlayback} playbackOffset={this.props.playbackOffset}
            audioData={this.props.audioData} bpm={this.props.bpm} ctx={audioCtx}
            playbackRate={this.props.playbackRate} />
        </div>
      </HotKeys>
    );
  },

  render() {
    return (
      <div>
        {this.props.audioData ? this.renderLoaded() : null}
      </div>
    );
  },
});

function select(state, props) {
  const slug = props.params.slug;

  return {
    song: state.songs.songs.get(slug),

    songNotes: state.chart.notes,
    bpm: state.chart.bpm,

    inPlayback: state.playback.inPlayback,
    playbackOffset: state.playback.playbackOffset,
    playbackNotes: state.playback.notes,
    playbackRate: state.playback.playbackRate,

    audioData: state.audio.audioData.get(slug),

    fps: state.fps,
  };
}

export default connect(select)(Editor);
