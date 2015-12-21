import _ from 'lodash';
import createImmutableReducer from '../util/immutableReducer';
import {TICK} from '../ActionTypes';

const initialState = 0;

// via http://stackoverflow.com/a/87732
const maxSamples = 100;

let tickIdx = 0;
let tickSum = 0;
const tickList = _.range(0, maxSamples).map(() => 0);

const fpsReducer = createImmutableReducer(initialState, {
  [TICK]: function({dt}) {
    tickSum -= tickList[tickIdx];
    tickSum += dt;
    tickList[tickIdx] = dt;

    tickIdx += 1;
    if (tickIdx === maxSamples) {
      tickIdx = 0;
    }

    return 1000 / (tickSum / maxSamples);
  }
});

export default fpsReducer;
