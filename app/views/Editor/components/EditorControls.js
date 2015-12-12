import React from 'react';
import { connect } from 'react-redux';

import {Button, Well} from 'react-bootstrap';
import SaveModal from './SaveModal';
import BlurInput from '../../../../vendor/BlurInput';

import {
  updateRate
} from '../../../actions/PlaybackActions';


function serializeData(chartData) {
  const {notes, bpm} = chartData;

  const serialized = JSON.stringify({notes, bpm});

  return serialized;
}

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
    const serialized = serializeData(this.props.chartData);

    const modal = (
      <SaveModal data={serialized} onClose={() => this.requestCloseModal()} />
    );

    this.setState({
      openModal: modal
    });
  }

  handlePlaybackRateChange(val) {
    this.props.dispatch(updateRate(val));
  }

  render() {
    return (
      <Well style={{marginBottom: 0}}>
        <Button onClick={() => this.handleSave()}>
          Save
        </Button>

        <label>
          Playback Rate
          <BlurInput className="input form-control" value={this.props.playbackRate.toString()}
            onChange={(e) => this.handlePlaybackRateChange(e)} />
        </label>

        {this.state.openModal}
      </Well>
    );
  }
}

function select(state) {
  return {
    chartData: state.chart
  };
}

export default connect(select)(EditorControls);
