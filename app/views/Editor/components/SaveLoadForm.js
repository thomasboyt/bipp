import React from 'react/addons';

class AudioPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataValue: ''
    };
  }

  handleSave() {
    const dataValue = this.props.flux.getStore('editor').serializeData();

    this.setState({dataValue});
  }

  handleLoad() {
    this.props.flux.getActions('editor').loadData(this.state.dataValue);
  }

  handleDataChange(e) {
    this.setState({
      dataValue: e.target.value
    });
  }

  render() {
    return (
      <fieldset>
        <button onClick={() => this.handleSave()}>
          Save
        </button>
        <button onClick={() => this.handleLoad()}>
          Load
        </button>

        <label>
          Data&nbsp;
          <input type="text" value={this.state.dataValue}
            onChange={(e) => this.handleDataChange(e)}/>
        </label>
      </fieldset>
    );
  }
}

export default AudioPicker;
