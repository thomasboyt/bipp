import createBrowserHistory from 'history/lib/createBrowserHistory';
import createMemoryHistory from 'history/lib/createMemoryHistory';

let history;

if (process.env.NODE_ENV === 'production') {
  history = createMemoryHistory();
} else {
  history = createBrowserHistory();
}

export default history;
