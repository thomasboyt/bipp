import React from 'react';
import FluxComponent from 'flummox/component';

class LogIn extends React.Component {
  render() {
    return (
      <FluxComponent flux={this.props.flux} connectToStores={['editor']}>
        <span>Hello world</span>
      </FluxComponent>
    );
  }
}

export default LogIn;
