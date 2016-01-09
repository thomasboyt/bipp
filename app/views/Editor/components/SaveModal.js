import React from 'react';
import {Button, Modal} from 'react-bootstrap';

const SaveModal = React.createClass({
  propTypes: {
    data: React.PropTypes.string.isRequired,
    onClose: React.PropTypes.func.isRequired,
  },

  // Select all data text on click
  handleClickData() {
    const el = this.refs.data;

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
  },

  render() {
    return (
      <Modal show title="Save" onHide={this.props.onClose}>
        <Modal.Header>
          <Modal.Title>
            Save
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            (click to select)
          </p>
          <pre style={{'height': '300px'}} onClick={() => this.handleClickData()} ref="data">
            {this.props.data}
          </pre>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  },
});

export default SaveModal;
