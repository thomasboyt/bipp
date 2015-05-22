import React from 'react';
import {Route} from 'react-router';

import App from '../views/App';

module.exports = (
  <Route handler={App}>

    <Route name="editor"
      path="/"
      handler={require('../views/Editor/Handler')} />

  </Route>
);
