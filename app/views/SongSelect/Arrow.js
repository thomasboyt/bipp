import React from 'react';
import RenderedCanvas from '../lib/RenderedCanvas';

const UP = 'up';
const DOWN = 'down';
const LEFT = 'left';
const RIGHT = 'right';

/*
 * this is a triangle. I am so bad at image editing that it was literally faster to do this
 * than to make triangles of various sizes. shut up.
 */
const Arrow = React.createClass({
  propTypes: {
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    dir: React.PropTypes.oneOf([
      UP, DOWN, LEFT, RIGHT
    ]).isRequired,
    color: React.PropTypes.string
  },

  getInternalHeight() {
    return this.props.height / 2;
  },

  getInternalWidth() {
    return this.props.width / 2;
  },

  getDefaultProps() {
    return {
      color: 'white'
    };
  },

  renderArrow(ctx) {
    ctx.save();

    if (this.props.dir === LEFT) {
      ctx.translate(this.getInternalWidth(), 0);
      ctx.scale(-1, 1);
    }

    ctx.fillStyle = this.props.color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, this.getInternalHeight());
    ctx.lineTo(this.getInternalWidth(), this.getInternalHeight() / 2);
    ctx.fill();

    ctx.restore();
  },

  render() {
    return (
      <RenderedCanvas isStatic render={this.renderArrow}
        style={{height: this.props.height, width: this.props.width}}
        className="arrow"
        height={this.getInternalHeight()} width={this.getInternalWidth()}
        onClick={this.props.onClick} />
    );
  }
});

export default Arrow;
