import React from 'react/addons';
import {Button, Modal} from 'react-bootstrap';

class SaveModal extends React.Component {

  // Select all data text on click
  handleClickData() {
    const el = this.refs.data.getDOMNode();

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  render() {
    return (
      <Modal title="Save" onRequestHide={this.props.onClose}>
        <div className="modal-body">
          <p>
            (click to select)
          </p>
          <pre style={{'height': '300px'}} onClick={() => this.handleClickData()} ref="data">
            {this.props.data}
          </pre>
        </div>
        <div className='modal-footer'>
          <Button onClick={this.props.onClose}>
            Close
          </Button>
        </div>
      </Modal>
    );
  }
}

SaveModal.propTypes = {
  data: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func.isRequired,
};

export default SaveModal;
