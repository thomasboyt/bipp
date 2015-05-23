import React from 'react/addons';

class AudioPlayback extends React.Component {
  componentWillMount() {
    this.volumeNode = this.props.ctx.createGain();
    this.volumeNode.connect(this.props.ctx.destination);
    this.volumeNode.gain.value = 0.5;
  }

  play() {
    const src = this.props.ctx.createBufferSource();
    src.connect(this.volumeNode);
    src.buffer = this.props.audioData;

    // TODO: second value represents starting time in sec, use for offset
    const beatOffset = this.props.playbackOffset / 24;
    const secPerBeat = 60 / this.props.bpm;
    const offsetSec = secPerBeat * beatOffset;

    src.start(0, offsetSec);

    this.src = src;
  }

  stop() {
    this.src.stop();
  }

  componentWillReceiveProps(nextProps) {
    const curProps = this.props;

    if (nextProps.playing !== curProps.playing) {
      if (!nextProps.playing) {
        this.stop();
      } else {
        this.play();
      }
    }

    if (nextProps.audioData !== curProps.audioData) {
      if (nextProps.audioData) {
        this.loadAudio(nextProps.audioData);
      } else {
        this.buf = null;
      }
    }
  }

  render() {
    return <span />;
  }
}

AudioPlayback.propTypes = {
  playing: React.PropTypes.bool.isRequired,
  playbackOffset: React.PropTypes.number,
  ctx: React.PropTypes.object.isRequired,
  audioData: React.PropTypes.object.isRequired

  // TODO: audio ArrayBuffer
  // Also need BPM+Song Offset to calculcate seconds
};

export default AudioPlayback;
