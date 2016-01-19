import { browserHistory, createMemoryHistory } from 'react-router';

let history;

if (process.env.NODE_ENV === 'production') {
  history = createMemoryHistory();
} else {
  history = browserHistory;
}

export default history;
