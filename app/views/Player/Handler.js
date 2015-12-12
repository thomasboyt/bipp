import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Loading from './states/Loading';
import Loaded from './states/Loaded';
import Playing from './states/Playing';
import Done from './states/Done';

import {
  resetPlayback,
} from '../../actions/PlaybackActions';

import {
  loadSong,
} from '../../actions/ChartActions';

import {
  loadAudio,
} from '../../actions/AudioActions';


const STATE_LOADING = 'loading';
const STATE_LOADED = 'loaded';
const STATE_PLAYING = 'playing';
const STATE_DONE = 'done';

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      didPlayback: false,
    };
  }

  componentWillMount() {
    const idx = this.props.params.songIdx;
    const difficulty = this.props.params.difficulty;
    this.props.dispatch(loadSong(idx, difficulty));
    this.props.dispatch(loadAudio(idx));
  }

  componentWillUnmount() {
    this.props.dispatch(resetPlayback());
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this).focus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.inPlayback && !this.props.inPlayback) {
      this.setState({
        didPlayback: true
      });
    }
  }

  getState() {
    // TODO: Replace this with a proper state machine so we can easily go from playing -> done -> playing...
    if (this.props.inPlayback) {
      return STATE_PLAYING;
    } else if (this.state.didPlayback) {
      return STATE_DONE;
    } else if (this.props.audioLoaded && this.props.songLoaded) {
      return STATE_LOADED;
    } else {
      return STATE_LOADING;
    }
  }

  render() {
    let outlet;

    if (this.getState() === STATE_LOADING) {
      outlet = <Loading />;
    } else if (this.getState() === STATE_LOADED) {
      outlet = <Loaded />;
    } else if (this.getState() === STATE_PLAYING) {
      outlet = <Playing />;
    } else if (this.getState() === STATE_DONE) {
      outlet = <Done />;
    }

    return outlet;
  }
}

function select(state) {
  return {
    songLoaded: state.chart.loaded,

    inPlayback: state.playback.inPlayback,

    audioLoaded: !!state.audio.audioData,
  };
}

export default connect(select)(Player);
