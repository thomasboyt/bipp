import React from 'react';
import {Router} from 'react-router';
import {Provider} from 'react-redux';

import DevTools from '../DevTools';

const Root = React.createClass({
  render() {
    const {store, history, routes} = this.props;

    return (
      <Provider store={store}>
        <div className="root">
          <Router history={history}>
            {routes}
          </Router>

          <DevTools />
        </div>
      </Provider>
    );
  }
});

export default Root;
