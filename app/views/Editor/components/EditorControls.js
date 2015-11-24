import React from 'react';
import {Button, Well} from 'react-bootstrap';
import Overlay from '../../lib/Overlay';
import SaveModal from './SaveModal';
import BlurInput from '../../../../vendor/BlurInput';

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

  handlePlaybackRateChange(val) {
    this.props.flux.getActions('playback').updateRate(val);
  }

  render() {
    return (
      <Overlay openModal={this.state.openModal}>
        <Well style={{marginBottom: 0}}>
          <Button onClick={() => this.handleSave()}>
            Save
          </Button>

          <label>
            Playback Rate
            <BlurInput className="input form-control" value={this.props.playbackRate.toString()}
              onChange={(e) => this.handlePlaybackRateChange(e)} />
          </label>
        </Well>
      </Overlay>
    );
  }
}

export default EditorControls;
