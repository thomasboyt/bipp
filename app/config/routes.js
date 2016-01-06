import React from 'react';
import {Route} from 'react-router';

import App from '../views/App';

export default (
  <Route handler={App}>

    <Route
      path="/"
      component={require('../views/Attract/Handler').default} />

    <Route
      path="/song-select"
      component={require('../views/SongSelect/Handler').default} />

    <Route
      path="/songs-list"
      component={require('../views/SongList/Handler').default} />

    <Route
      path="/edit/:slug/:difficulty"
      component={require('../views/Editor/Handler').default} />

    <Route
      path="/play/:slug/:difficulty"
      component={require('../views/Player/Handler').default} />

  </Route>
);
