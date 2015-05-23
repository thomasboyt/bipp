import React from 'react/addons';
import BlurInput from '../../../../vendor/BlurInput';

class AudioPicker extends React.Component {
  handleSelectFile(e) {
    const input = e.target;
    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = (e) => {
      const ab = e.target.result;
      this.props.flux.getActions('audio').loadAudio(ab);
    };

    reader.readAsArrayBuffer(file);
  }

  handleChangeBPM(val) {
    const bpm = parseInt(val, 10);

    if (Number.isNaN(bpm)) {
      return;
    }

    this.props.flux.getActions('editor').changeBPM(bpm);
  }

  render() {
    return (
      <fieldset>
        <input type="file" onChange={(e) => this.handleSelectFile(e)} />
        <label>
          BPM&nbsp;
          <BlurInput type="number" onChange={(e) => this.handleChangeBPM(e)}
            value={this.props.bpm.toString()} />
        </label>
      </fieldset>
    );
  }
}

export default AudioPicker;
