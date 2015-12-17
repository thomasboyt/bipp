import React from 'react';
import pureRender from '../../../../util/pureRender';

import {LANE_WIDTH, CENTER_LANE_WIDTH, NOTE_HEIGHT, colors} from '../constants';

class Note extends React.Component {
  render() {
    const note = this.props.note;

    const offset = (this.props.beatSpacing / 24) * note.totalOffset;
    const y = offset - NOTE_HEIGHT / 2;

    const color = colors[note.col];

    let x, width;
    if (note.col < 3) {
      x = note.col * LANE_WIDTH;
      width = LANE_WIDTH;
    } else if (note.col === 3) {
      x = note.col * LANE_WIDTH;
      width = CENTER_LANE_WIDTH;
    } else if (note.col > 3) {
      x = CENTER_LANE_WIDTH + (note.col - 1) * LANE_WIDTH;
      width = LANE_WIDTH;
    }

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={NOTE_HEIGHT}
        fill={color[0]}
        stroke={color[1]} />
    );
  }
}

pureRender(Note);

Note.propTypes = {
  note: React.PropTypes.object.isRequired,
  beatSpacing: React.PropTypes.number.isRequired
};

export default Note;
