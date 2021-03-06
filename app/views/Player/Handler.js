import React from 'react';
import { connect } from 'react-redux';

import Loading from './states/Loading';
import Loaded from './states/Loaded';
import Playing from './states/Playing';
import Done from './states/Done';
import GameWrapper from '../lib/GameWrapper';

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

const Player = React.createClass({
  getInitialState() {
    return {
      didPlayback: false,
    };
  },

  componentWillMount() {
    const difficulty = this.props.params.difficulty;
    this.props.dispatch(loadSong(this.props.song, difficulty));

    if (!this.props.audioData) {
      this.props.dispatch(loadAudio(this.props.song));
    }
  },

  componentWillUnmount() {
    this.props.dispatch(resetPlayback());
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.inPlayback && !this.props.inPlayback) {
      this.setState({
        didPlayback: true
      });
    }
  },

  getState() {
    // TODO: Replace this with a proper state machine so we can easily go from playing -> done -> playing...
    if (this.props.inPlayback) {
      return STATE_PLAYING;
    } else if (this.state.didPlayback) {
      return STATE_DONE;
    } else if (this.props.audioData && this.props.songLoaded) {
      return STATE_LOADED;
    } else {
      return STATE_LOADING;
    }
  },

  render() {
    let outlet;

    if (this.getState() === STATE_LOADING) {
      outlet = <Loading />;
    } else if (this.getState() === STATE_LOADED) {
      outlet = <Loaded />;
    } else if (this.getState() === STATE_PLAYING) {
      outlet = <Playing audioData={this.props.audioData} />;
    } else if (this.getState() === STATE_DONE) {
      outlet = <Done />;
    }

    return (
      <GameWrapper>
        {outlet}
      </GameWrapper>
    );
  }
});

function select(state, props) {
  const slug = props.params.slug;

  return {
    song: state.songs.songs.get(slug),

    songLoaded: state.chart.loaded,

    inPlayback: state.playback.inPlayback,

    audioData: state.audio.audioData.get(slug),
  };
}

export default connect(select)(Player);
