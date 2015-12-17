import React from 'react';
import pureRender from '../../../../util/pureRender';

import {WIDTH} from '../constants';

class Measure extends React.Component {
  render() {
    const num = this.props.num;

    return (
      <svg y={num * this.props.beatSpacing * 4} style={{overflow: 'visible'}}>
        <line x1="0" x2={WIDTH} style={{strokeWidth: 3}}
          y1={this.props.beatSpacing * 0} y2={this.props.beatSpacing * 0} stroke="black" />
        <line x1="0" x2={WIDTH} style={{strokeWidth: 2}}
          y1={this.props.beatSpacing * 1} y2={this.props.beatSpacing * 1} stroke="grey" />
        <line x1="0" x2={WIDTH} style={{strokeWidth: 2}}
          y1={this.props.beatSpacing * 2} y2={this.props.beatSpacing * 2} stroke="grey" />
        <line x1="0" x2={WIDTH} style={{strokeWidth: 2}}
          y1={this.props.beatSpacing * 3} y2={this.props.beatSpacing * 3} stroke="grey" />
      </svg>
    );
  }
}

pureRender(Measure);

Measure.propTypes = {
  beatSpacing: React.PropTypes.number.isRequired,
  num: React.PropTypes.number.isRequired
};

export default Measure;
