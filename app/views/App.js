import React from 'react';
import {RouteHandler} from 'react-router';

class App extends React.Component {
  render() {
    return (
      <div className="root">
        <RouteHandler {...this.props} />
      </div>
    );
  }
}

export default App;
