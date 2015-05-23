import React from 'react/addons';

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

  render() {
    return (
      <input type="file" onChange={(e) => this.handleSelectFile(e)} />
    );
  }
}

export default AudioPicker;
