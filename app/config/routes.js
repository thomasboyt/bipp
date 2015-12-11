import React from 'react';
import {Route} from 'react-router';

import App from '../views/App';

export default (
  <Route handler={App}>

    <Route
      path="/"
      component={require('../views/SongList/Handler').default} />

    <Route
      path="/edit/:songIdx/:difficulty"
      component={require('../views/Editor/Handler').default} />

    <Route
      path="/play/:songIdx/:difficulty"
      component={require('../views/Player/Handler').default} />

  </Route>
);
