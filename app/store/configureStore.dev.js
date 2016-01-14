import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import appReducer from '../reducers';
import DevTools from '../views/DevTools';

const createStoreWithMiddleware = compose(
  applyMiddleware(thunkMiddleware),
  DevTools.instrument()
)(createStore);

export default function createAppStore(data) {
  return createStoreWithMiddleware(appReducer, data);
}
