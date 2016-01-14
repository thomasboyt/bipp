import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import appReducer from '../reducers';

const createStoreWithMiddleware = compose(
  applyMiddleware(thunkMiddleware)
)(createStore);

export default function createAppStore(data) {
  return createStoreWithMiddleware(appReducer, data);
}
