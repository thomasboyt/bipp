import React from 'react/addons';
import {Button, Well} from 'react-bootstrap';
import Overlay from '../../lib/Overlay';
import SaveModal from './SaveModal';

class EditorControls extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: null
    };
  }

  requestCloseModal() {
    this.setState({openModal: null});
  }

  handleSave() {
    const serialized = this.props.flux.getStore('song').serializeData();

    const modal = (
      <SaveModal data={serialized} onClose={() => this.requestCloseModal()} />
    );

    this.setState({
      openModal: modal
    });
  }

  render() {
    return (
      <Overlay openModal={this.state.openModal}>
        <Well style={{marginBottom: 0}}>
          <Button onClick={() => this.handleSave()}>
            Save
          </Button>
        </Well>
      </Overlay>
    );
  }
}

export default EditorControls;
