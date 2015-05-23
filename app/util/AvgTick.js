import {range} from 'lodash';

// Calculate average delta time over last maxSamples frames
// via http://stackoverflow.com/a/87732
class AvgTick {
  constructor(maxSamples) {
    this.tickIdx = 0;
    this.tickSum = 0;
    this.tickList = range(0, maxSamples).map(() => 0);
    this.maxSamples = maxSamples;
  }

  update(dt) {
    this.tickSum -= this.tickList[this.tickIdx];
    this.tickSum += dt;
    this.tickList[this.tickIdx] = dt;

    this.tickIdx += 1;
    if (this.tickIdx === this.maxSamples) {
      this.tickIdx = 0;
    }
  }

  get() {
    return this.tickSum / this.maxSamples;
  }
}

export default AvgTick;
