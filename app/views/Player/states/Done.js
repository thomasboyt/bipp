import React from 'react';
import { connect } from 'react-redux';

const Done = React.createClass({
  propTypes: {
    judgements: React.PropTypes.object.isRequired,
  },

  renderJudgements() {
    return this.props.judgements.map((v, k) => {
      return (
        <tr key={k}>
          <td>{k}</td>
          <td>{v}</td>
        </tr>
      );
    }).valueSeq().toJS();
  },

  render() {
    return (
      <div className="player-container">
        <div className="help-text-container">
          <table>
            <tbody>
              {this.renderJudgements()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});

function select(state) {
  return {
    judgements: state.playback.judgements,
  };
}

export default connect(select)(Done);
