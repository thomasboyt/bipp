import React from 'react';
import pureRender from '../../../../util/pureRender';
import { Iterable, Range } from 'immutable';

import Measure from './Measure';
import Note from './Note';

/**
 * This piece is kept separate because it only re-renders if the following props change:
 *
 * - Notes
 * - Number of measures in song
 * - Beat spacing
 *
 * This DRASTICALLY improves playback performance, as it keeps per-frame rerendering in its
 * containing <Chart />, which handles the translation that scrolls the chart based on the
 * current offset.
 */
class InnerChart extends React.Component {
  renderMeasures() {
    const range = Range(0, this.props.numMeasures);

    return range.map((num) => {
      return (
        <Measure key={`measure-${num}`} beatSpacing={this.props.beatSpacing} num={num} />
      );
    });
  }

  renderNotes() {
    const notes = this.props.notes;

    return notes.map((note) => {
      const key = `note-${note.totalOffset}-${note.col}`;

      return (
        <Note key={key} beatSpacing={this.props.beatSpacing} note={note} />
      );
    });
  }

  render() {
    return (
      <g>
        {this.props.showMeasures ? this.renderMeasures() : null}
        {this.renderNotes()}
      </g>
    );
  }
}

pureRender(InnerChart);

InnerChart.propTypes = {
  numMeasures: React.PropTypes.number.isRequired,
  notes: React.PropTypes.instanceOf(Iterable).isRequired,
  beatSpacing: React.PropTypes.number.isRequired
};

export default InnerChart;
