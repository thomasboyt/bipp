import React from 'react';
import FluxComponent from 'flummox/component';
import {HotKeys} from 'react-hotkeys';

import AudioPlayback from '../lib/AudioPlayback';
import Chart from '../lib/Chart';

import EditorControls from './components/EditorControls';


const resolutions = [24, 12, 8, 6, 4, 3];

const colMap = {
  's': 0,
  'd': 1,
  'f': 2,
  'space': 3,
  'j': 4,
  'k': 5,
  'l': 6
};

const findSmallestResIdx = function(offset) {
  for (let i = 0; i < resolutions.length; i++) {
    if (offset % resolutions[i] === 0) {
      return i;
    }
  }
};

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      scrollResolutionIdx: 0,
      beatSpacing: 80
    };
  }

  getKeyMap() {
    if (this.props.inPlayback) {
      return {
        'exitPlayback': ['p', 'esc'],
        'playNote': ['s', 'd', 'f', 'space', 'j', 'k', 'l']
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
  }

  setOffset(nextOffset) {
    if (nextOffset <= this.getMaxOffset() && nextOffset >= 0) {
      this.setState({
        offset: nextOffset
      });
    }
  }

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
        this.props.flux.getActions('playback').enterPlayback(this.state.offset, this.props.bpm, this.getNotes());
      },

      exitPlayback: () => {
        this.props.flux.getActions('playback').exitPlayback();
      },

      toggleNote: (e, key) => {
        const col = colMap[key];

        this.props.flux.getActions('song').toggleNote(this.state.offset, col);
      },

      playNote: (e, key) => {
        const col = colMap[key];

        this.props.flux.getActions('playback').playNote(Date.now(), col);
      }
    };
  }

  getOffset() {
    if (this.props.inPlayback) {
      return this.props.playbackOffset;
    } else {
      return this.state.offset;
    }
  }

  getNotes() {
    if (this.props.inPlayback) {
      return this.props.playbackNotes;
    } else {
      return this.props.songNotes;
    }
  }

  getScrollResolution() {
    return resolutions[this.state.scrollResolutionIdx];
  }

  getNumMeasures() {
    const len = this.props.flux.getStore('audio').getLength();
    return this.props.flux.getStore('song').getNumMeasures(len);
  }

  getMaxOffset() {
    return this.getNumMeasures() * 4 * 24 - 24;
  }

  getLastNoteOffset() {
    const lastNote = this.props.songNotes.maxBy((note) => note.beat * 24 + note.offset);
    const lastOffset = lastNote.beat * 24 + lastNote.offset;

    return lastOffset;
  }

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
  }

  renderChart() {
    return (
      <Chart
        notes={this.getNotes()}
        offset={this.getOffset()}
        beatSpacing={this.state.beatSpacing}

        showMeasures
        showOffsetText
        scrollResolution={this.getScrollResolution()}
        numMeasures={this.getNumMeasures()}
        offsetPositionYPercent={0.7} />
    );
  }

  renderLoaded() {
    return (
      <span>
        <div className="editor">
          <HotKeys handlers={this.getHandlers()} keyMap={this.getKeyMap()}
            className="chart-container">
            {this.renderChart()}
          </HotKeys>

          <EditorControls flux={this.props.flux} />
        </div>

        <AudioPlayback playing={this.props.inPlayback} playbackOffset={this.state.offset}
          audioData={this.props.audioData} bpm={this.props.bpm} ctx={this.props.audioCtx} />
      </span>
    );
  }

  render() {
    return (
      <div>
        {this.props.audioData ? this.renderLoaded() : null}
      </div>
    );
  }
}

class EditorOuter extends React.Component {
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
          bpm: store.state.bpm
        }),

        playback: (store) => ({
          inPlayback: store.state.inPlayback,
          playbackOffset: store.state.playbackOffset,
          playbackNotes: store.state.notes
        }),

        audio: (store) => ({
          audioData: store.state.audioData,
          audioCtx: store.state.ctx
        })
      }}>
        <Editor />
      </FluxComponent>
    );
  }
}

export default EditorOuter;
