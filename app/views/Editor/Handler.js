import React from 'react';
import FluxComponent from 'flummox/component';
import { Range } from 'immutable';
import AudioPlayback from './components/AudioPlayback';
import AudioPicker from './components/AudioPicker';

import ordinal from '../../util/ordinal';

const VIEWPORT_HEIGHT = 600;
const WIDTH = 450;
const LANE_WIDTH = 60;
const NOTE_HEIGHT = 20;

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

    if (!len) {
      // No audio == no measures
      return null;
    }

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

  handleKeyPress(e) {
    e.preventDefault();
    const PG_UP = 33;
    const PG_DOWN = 34;
    const UP_ARROW = 38;
    const DOWN_ARROW = 40;

    const LEFT_ARROW = 37;
    const RIGHT_ARROW = 39;

    const MINUS = 189;
    const EQUAL = 187;

    const ESC_KEY = 27;
    const P_KEY = 80;

    const toggleNoteMap = {
      83: 0,  // s
      68: 1,  // d
      70: 2,  // f
      32: 3,  // space
      74: 4,  // j
      75: 5,  // k
      76: 6   // l
    };

    if (this.props.inPlayback) {
      if (e.keyCode === ESC_KEY || e.keyCode === P_KEY) {
        this.props.flux.getActions('editor').exitPlayback();
      }

    } else {
      if (e.keyCode === UP_ARROW) {
        // TODO: Check for max offset

        this.setState((state) => ({
          offset: state.offset + this.getScrollResolution()
        }));

      } else if (e.keyCode === DOWN_ARROW) {
        const nextOffset = this.state.offset - this.getScrollResolution();

        if (nextOffset >= 0) {
          this.setState({
            offset: nextOffset
          });
        }

      } else if (e.keyCode === PG_UP) {
        // TODO: Check for max offset

        this.setState((state) => ({
          offset: state.offset + (24 * 4)
        }));

      } else if (e.keyCode === PG_DOWN) {
        const nextOffset = this.state.offset - (24 * 4);

        if (nextOffset >= 0) {
          this.setState({
            offset: nextOffset
          });
        }

      } else if (e.keyCode === MINUS) {
        this.setState({
          beatSpacing: this.state.beatSpacing - 40
        });

      } else if (e.keyCode === EQUAL) {
        this.setState({
          beatSpacing: this.state.beatSpacing + 40
        });

      } else if (e.keyCode === LEFT_ARROW) {
        this.handleUpdateScrollResolution(false);

      } else if (e.keyCode === RIGHT_ARROW) {
        this.handleUpdateScrollResolution(true);

      } else if (e.keyCode === P_KEY) {
        this.props.flux.getActions('editor').enterPlayback(this.state.offset);

      } else if (toggleNoteMap[e.keyCode] !== undefined) {
        this.handleToggleNote(toggleNoteMap[e.keyCode]);

      } else {
        console.log(e.keyCode);
      }
    }
  }

  renderOffsetBar() {
    const noteName = ordinal((24 / this.getScrollResolution()) * 4);

    const beat = Math.floor(this.getOffset() / 24 / 4) + 1;
    const text = `${noteName}\n ${beat}`;

    const y = this.getOffset() *  (this.state.beatSpacing/24);

    return (
      <g>
        <rect x="0" y={y - NOTE_HEIGHT / 2} width={WIDTH} height={NOTE_HEIGHT}
          fill="#4A90E2"/>

        <text x={WIDTH + 10} y={-y} transform={`scale(1, -1)`}
          style={{fontFamily: 'Helvetica, sans-serif', fontSize: '16px',
                  dominantBaseline: 'central'}}>
          {text}
        </text>
      </g>
    );
  }

  renderMeasures() {
    const range = Range(0, this.getNumMeasures());

    return range.map((num) => {
      return (
        <svg key={`measure-${num}`} y={num * this.state.beatSpacing * 4} style={{overflow:"visible"}}>
          <line x1="0" x2={WIDTH}
            y1={this.state.beatSpacing * 0} y2={this.state.beatSpacing * 0} stroke="black" />
          <line x1="0" x2={WIDTH}
            y1={this.state.beatSpacing * 1} y2={this.state.beatSpacing * 1} stroke="grey" />
          <line x1="0" x2={WIDTH}
            y1={this.state.beatSpacing * 2} y2={this.state.beatSpacing * 2} stroke="grey" />
          <line x1="0" x2={WIDTH}
            y1={this.state.beatSpacing * 3} y2={this.state.beatSpacing * 3} stroke="grey" />
        </svg>
      );
    });
  }

  renderNotes() {
    const notes = this.props.notes;

    return notes.map((note) => {
      const beatOffset = note.beat * this.state.beatSpacing;
      const offset = (this.state.beatSpacing / 24) * note.offset;
      const y = beatOffset + offset - NOTE_HEIGHT / 2;

      const key = `note-${note.beat}-${note.offset}-${note.col}`;

      return (
        <rect key={key}
          x={note.col * LANE_WIDTH}
          y={y}
          width={LANE_WIDTH}
          height={NOTE_HEIGHT} />
      );
    });
  }

  renderChart() {
    const height = this.getNumMeasures() * this.state.beatSpacing * 4;
    const offset = this.getOffset() * (this.state.beatSpacing / 24);

    const scrollY = -1 * (height - offset - (VIEWPORT_HEIGHT * 0.7));

    return (
      <svg width={WIDTH + 100} height={VIEWPORT_HEIGHT}>
        <g transform={`translate(0, ${scrollY})`}>
          <g transform={`translate(0, ${height}) scale(1, -1)`}>
            {this.renderOffsetBar()}
            {this.renderMeasures()}
            {this.renderNotes()}
          </g>
        </g>
      </svg>
    );
  }

  renderLoaded() {
    return (
      <div onKeyDown={(e) => this.handleKeyPress(e)} tabIndex="1">
        {this.renderChart()}
        <AudioPlayback playing={this.props.inPlayback} playbackOffset={this.state.offset}
          audioData={this.props.audioData} bpm={this.props.bpm} ctx={this.props.audioCtx}  />
      </div>
    );
  }

  render() {
    return (
      <div>
        <AudioPicker flux={this.props.flux} />
        <br/>
        {this.props.audioData ? this.renderLoaded() : null}
      </div>
    );
  }
}

class EditorOuter extends React.Component {
  render() {
    return (
      <FluxComponent flux={this.props.flux} connectToStores={{
        editor: (store) => ({
          notes: store.state.notes,
          bpm: store.state.bpm,

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
