import React from 'react';

import { createDevTools } from 'redux-devtools';

import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';
import FilterMonitor from 'redux-devtools-filter-actions';

import {TICK} from '../ActionTypes';

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
    <FilterMonitor blacklist={[TICK]}>
      <LogMonitor theme="tomorrow" />
    </FilterMonitor>
  </DockMonitor>
);

export default DevTools;
