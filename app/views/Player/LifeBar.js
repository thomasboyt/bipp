import React from 'react';

import RenderedCanvas from '../lib/RenderedCanvas';

const LifeBar = React.createClass({
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,

    hp: React.PropTypes.number.isRequired,
  },

  renderCanvas(ctx) {
    const percentFilled = this.props.hp / 100;

    const borderWidth = 3;

    ctx.fillStyle = 'red';
    ctx.fillRect(borderWidth, borderWidth,
                 this.props.width - borderWidth * 2, this.props.height - borderWidth * 2);

    ctx.fillStyle = 'yellow';
    ctx.fillRect(borderWidth, borderWidth,
                 (this.props.width - borderWidth * 2) * percentFilled,
                 this.props.height - borderWidth * 2);
  },

  render() {
    return (
      <RenderedCanvas render={this.renderCanvas} width={this.props.width}
        height={this.props.height} className="life-bar" />
    );
  }
});

export default LifeBar;
