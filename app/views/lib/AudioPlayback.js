import React from 'react/addons';

const MUTE = document.location.hash.indexOf('mute') !== -1;

class AudioPlayback extends React.Component {
  componentWillMount() {
    this.volumeNode = this.props.ctx.createGain();
    this.volumeNode.connect(this.props.ctx.destination);

    if (MUTE) {
      this.volumeNode.gain.value = 0;
    } else {
      this.volumeNode.gain.value = 0.5;
    }

    if (this.props.playing) {
      this.play();
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  componentWillReceiveProps(nextProps) {
    const curProps = this.props;

    if (nextProps.playing !== curProps.playing) {
      if (!nextProps.playing) {
        this.stop();
      } else {
        this.play(nextProps);
      }
    }
  }

  play(props) {
    this.src = props.ctx.createBufferSource();
    this.src.buffer = this.props.audioData;
    this.src.connect(this.volumeNode);

    // playbackOffset is in 1/24th beats, convert to # of beats
    const beatOffset = this.props.playbackOffset / 24;


    this.src.playbackRate.value = props.playbackRate || 1;

    this.src.start(0, offsetSec);
  }

  stop() {
    if (this.src) {
      this.src.stop();
    }
  }

  render() {
    return <span />;
  }
}

AudioPlayback.propTypes = {
  // Whether the audio is playing or stopped
  playing: React.PropTypes.bool.isRequired,

  // The offset, in 1/24th beats, to start playing at
  playbackOffset: React.PropTypes.number.isRequired,

  // bpm of current audio track
  bpm: React.PropTypes.number.isRequired,

  // TODO: make these objects more specific
  ctx: React.PropTypes.object.isRequired,
  audioData: React.PropTypes.object.isRequired
};

export default AudioPlayback;
