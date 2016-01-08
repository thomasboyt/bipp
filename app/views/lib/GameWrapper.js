import React from 'react';

const GameWrapper = React.createClass({
  render() {
    return (
      <div className="in-game">
        {this.props.children}
      </div>
    );
  }
});

export default GameWrapper;
