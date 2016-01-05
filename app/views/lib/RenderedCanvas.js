import React from 'react';
import ReactDOM from 'react-dom';

import runLoop from '../../runLoop';

const RenderedCanvas = React.createClass({
  propTypes: {
    render: React.PropTypes.func.isRequired,
    params: React.PropTypes.object,
    makeStatic: React.PropTypes.bool,
  },

  componentDidMount() {
    this._canvas = ReactDOM.findDOMNode(this);
    this._ctx = this._canvas.getContext('2d');
    this.renderCanvas();

    if (!this.props.makeStatic) {
      runLoop.subscribe(this.renderCanvas);
    }
  },

  componentWillUnmount() {
    if (!this.props.makeStatic) {
      runLoop.unsubscribe(this.renderCanvas);
    }
  },

  renderCanvas() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this.props.render(this._ctx, this.props.params);
  },

  render() {
    return <canvas {...this.props} />;
  },
});

export default RenderedCanvas;
