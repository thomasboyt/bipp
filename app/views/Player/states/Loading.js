import React from 'react';

class Loading extends React.Component {
  render() {
    return (
      <div className="player-container in-game">
        <div className="help-text-container">
          <p>
            Loading...
          </p>
        </div>
      </div>
    );
  }
}

export default Loading;
