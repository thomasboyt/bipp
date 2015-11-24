import React from 'react';
import {OverlayMixin} from 'react-bootstrap';

const Overlay = React.createClass({
  mixins: [OverlayMixin],

  renderOverlay() {
    if (!this.props.openModal) {
      return <span />;
    }

    return this.props.openModal;
  },

  render() {
    return this.props.children;
  }
});

Overlay.propTypes = {
  openModal: React.PropTypes.node,
  children: React.PropTypes.node.isRequired
};

export default Overlay;
