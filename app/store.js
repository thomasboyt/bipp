import { createStore, applyMiddleware } from 'redux';

import thunkMiddleware from 'redux-thunk';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

import appReducer from './reducers';

export default function createAppStore(data) {
  return createStoreWithMiddleware(appReducer, data);
}
