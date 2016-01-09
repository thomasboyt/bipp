import React from 'react';
import I from 'immutable';
import { connect } from 'react-redux';

import {Button, Well} from 'react-bootstrap';
import SaveModal from './SaveModal';
import BlurInput from '../../../../vendor/BlurInput';

import {
  updateRate
} from '../../../actions/PlaybackActions';


function serializeData(chartData) {
  const {notes} = chartData;

  // Convert Notes from Record to Map so we can remove props from them
  const serializedNotes = notes.map((note) => I.Map(note).remove('time'));

  const serialized = JSON.stringify({notes: serializedNotes});

  return serialized;
}

const EditorControls = React.createClass({
  getInitialState() {
    return {
      openModal: null
    };
  },

  requestCloseModal() {
    this.setState({openModal: null});
  },

  handleSave() {
    const serialized = serializeData(this.props.chartData);

    const modal = (
      <SaveModal data={serialized} onClose={() => this.requestCloseModal()} />
    );

    this.setState({
      openModal: modal
    });
  },

  handlePlaybackRateChange(val) {
    this.props.dispatch(updateRate(val));
  },

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
  },
});

function select(state) {
  return {
    chartData: state.chart
  };
}

export default connect(select)(EditorControls);
