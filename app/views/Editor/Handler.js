import React from 'react';
import FluxComponent from 'flummox/component';
import { Range } from 'immutable';

import ordinal from '../../util/ordinal';

const VIEWPORT_HEIGHT = 600;
const WIDTH = 450;
const BEAT_SPACING = 80;
const LANE_WIDTH = 60;
const NOTE_HEIGHT = 20;

const resolutions = [24, 12, 8, 6, 4, 3];

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      scrollResolutionIdx: 0
    };
  }

  getOffset() {
    if (this.props.inPlayback) {
      return this.props.playbackOffset * (BEAT_SPACING/24);
    } else {
      return this.state.offset * (BEAT_SPACING/24);
    }
  }

  getScrollResolution() {
    return resolutions[this.state.scrollResolutionIdx];
  }

  handleToggleNote(column) {
    this.props.flux.getActions('editor').toggleNote(this.state.offset, column);
  }

  handleUpdateScrollResolution(increase) {
    const inc = increase ? 1 : -1;

    const nextRes = this.state.scrollResolutionIdx + inc;

    if (nextRes < 0 || nextRes >= resolutions.length) {
      return;
    }

    this.setState({
      scrollResolutionIdx: nextRes
    });
  }

  handleKeyPress(e) {
    const UP_ARROW = 38;
    const DOWN_ARROW = 40;
    const LEFT_ARROW = 37;
    const RIGHT_ARROW = 39;
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
        if (this.state.offset > 0) {
          this.setState((state) => ({
            offset: state.offset - this.getScrollResolution()
          }));
        }

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

    const y = this.getOffset();

    return (
      <g>
        <rect x="0" y={y - NOTE_HEIGHT / 2} width={WIDTH} height={NOTE_HEIGHT}
          fill="#4A90E2"/>

        <text x={WIDTH + 10} y={-y} transform={`scale(1, -1)`}
          style={{fontFamily: 'Helvetica, sans-serif', fontSize: '16px',
                  dominantBaseline: 'central'}}>
          {noteName}
        </text>
      </g>
    );
  }

  renderMeasures() {
    const numMeasures = this.props.numMeasures;

    const range = Range(0, numMeasures);

    return range.map((num) => {
      return (
        <svg key={`measure-${num}`} y={num * BEAT_SPACING * 4} style={{overflow:"visible"}}>
          <line x1="0" x2={WIDTH}
            y1={BEAT_SPACING * 0} y2={BEAT_SPACING * 0} stroke="black" />
          <line x1="0" x2={WIDTH}
            y1={BEAT_SPACING * 1} y2={BEAT_SPACING * 1} stroke="grey" />
          <line x1="0" x2={WIDTH}
            y1={BEAT_SPACING * 2} y2={BEAT_SPACING * 2} stroke="grey" />
          <line x1="0" x2={WIDTH}
            y1={BEAT_SPACING * 3} y2={BEAT_SPACING * 3} stroke="grey" />
        </svg>
      );
    });
  }

  renderNotes() {
    const notes = this.props.notes;

    return notes.map((note) => {
      const beatOffset = note.beat * BEAT_SPACING;
      const offset = (BEAT_SPACING / 24) * note.offset;
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

  render() {
    const height = this.props.numMeasures * BEAT_SPACING * 4;
    const offset = this.getOffset();

    const scrollY = -1 * (height - offset - (VIEWPORT_HEIGHT / 2));

    return (
      <div onKeyDown={(e) => this.handleKeyPress(e)} tabIndex="1">
        <svg width={WIDTH + 100} height={VIEWPORT_HEIGHT}>
          <g transform={`translate(0, ${scrollY})`}>
            <g transform={`translate(0, ${height}) scale(1, -1)`}>
              {this.renderOffsetBar()}
              {this.renderMeasures()}
              {this.renderNotes()}
            </g>
          </g>
        </svg>
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
          numMeasures: store.getNumMeasures(),

          inPlayback: store.state.inPlayback,
          playbackOffset: store.state.playbackOffset
        })
      }}>
        <Editor />
      </FluxComponent>
    );
  }
}

export default EditorOuter;
