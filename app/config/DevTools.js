import React from 'react';

import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import FilterMonitor from 'redux-devtools-filter-actions';

import {TICK} from '../ActionTypes';

export default (
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q" defaultIsVisible={false}>
    <FilterMonitor blacklist={[TICK]}>
      <LogMonitor theme="tomorrow" />
    </FilterMonitor>
  </DockMonitor>
);
