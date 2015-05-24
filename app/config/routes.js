import React from 'react';
import {Route} from 'react-router';

import App from '../views/App';

module.exports = (
  <Route handler={App}>

    <Route name="SongList"
      path="/"
      handler={require('../views/SongList/Handler')} />

    <Route name="Editor"
      path="/edit/:songIdx"
      handler={require('../views/Editor/Handler')} />

    <Route name="Player"
      path="/play/:songIdx"
      handler={require('../views/Player/Handler')} />

  </Route>
);
