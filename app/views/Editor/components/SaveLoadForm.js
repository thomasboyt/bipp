import React from 'react/addons';

class SaveForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataValue: ''
    };
  }

  handleSave() {
    const dataValue = this.props.flux.getStore('song').serializeData();

    this.setState({dataValue});
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

        <label>
          Data&nbsp;
          <input type="text" value={this.state.dataValue}
            onChange={(e) => this.handleDataChange(e)}/>
        </label>
      </fieldset>
    );
  }
}

export default SaveForm;
