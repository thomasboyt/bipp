import React from 'react';
import FluxComponent from 'flummox/component';
import {HotKeys} from 'react-hotkeys';

import AudioPlayback from './components/AudioPlayback';
import AudioPicker from './components/AudioPicker';
import SaveLoadForm from './components/SaveLoadForm';
import Chart from './components/Chart';


const resolutions = [24, 12, 8, 6, 4, 3];

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
        'exitPlayback': ['p', 'esc']
      };
    } else {
      return {
        'scrollUp': ['up', 'shift+k'],
        'scrollDown': ['down', 'shift+j'],
        'measureUp': 'pageup',
        'measureDown': 'pagedown',
        'zoomOut': '-',
        'zoomIn': '=',
        'scrollResDown': 'left',
        'scrollResUp': 'right',
        'enterPlayback': 'p',
        'toggleNote': ['s', 'd', 'f', 'space', 'j', 'k', 'l']
      };
    }
  }

  getHandlers() {
    return {
      scrollUp: (e) => {
        e.preventDefault();

        // TODO: Check for max offset

        this.setState((state) => ({
          offset: state.offset + this.getScrollResolution()
        }));
      },

      scrollDown: (e) => {
        e.preventDefault();

        const nextOffset = this.state.offset - this.getScrollResolution();

        if (nextOffset >= 0) {
          this.setState({
            offset: nextOffset
          });
        }
      },

      measureUp: (e) => {
        e.preventDefault();

        // TODO: Check for max offset

        this.setState((state) => ({
          offset: state.offset + (24 * 4)
        }));
      },

      measureDown: (e) => {
        e.preventDefault();

        const nextOffset = this.state.offset - (24 * 4);

        if (nextOffset >= 0) {
          this.setState({
            offset: nextOffset
          });
        }
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
        this.props.flux.getActions('playback').enterPlayback(this.state.offset, this.props.bpm);
      },

      exitPlayback: () => {
        this.props.flux.getActions('playback').exitPlayback();
      },

      toggleNote: (e, key) => {
        const colMap = {
          's': 0,
          'd': 1,
          'f': 2,
          'space': 3,
          'j': 4,
          'k': 5,
          'l': 6
        };

        const col = colMap[key];

        this.handleToggleNote(col);
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

  getScrollResolution() {
    return resolutions[this.state.scrollResolutionIdx];
  }

  getNumMeasures() {
    const len = this.props.flux.getStore('audio').getLength();
    return this.props.flux.getStore('editor').getNumMeasures(len);
  }

  handleToggleNote(column) {
    this.props.flux.getActions('editor').toggleNote(this.state.offset, column);
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
        numMeasures={this.getNumMeasures()}
        notes={this.props.notes}

        scrollResolution={this.getScrollResolution()}
        offset={this.getOffset()}
        beatSpacing={this.state.beatSpacing} />
    );
  }

  renderLoaded() {
    return (
      <span>
        <div className="editor">
          <div className="chart-container">
            <HotKeys handlers={this.getHandlers()} keyMap={this.getKeyMap()}>
              {this.renderChart()}
            </HotKeys>
          </div>

          <SaveLoadForm flux={this.props.flux} />
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
    this.props.flux.getActions('editor').loadSong(idx);
    this.props.flux.getActions('audio').loadAudio(idx);
  }

  render() {
    return (
      <FluxComponent flux={this.props.flux} connectToStores={{
        editor: (store) => ({
          notes: store.state.notes,
          bpm: store.state.bpm
        }),

        playback: (store) => ({
          inPlayback: store.state.inPlayback,
          playbackOffset: store.state.playbackOffset
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
