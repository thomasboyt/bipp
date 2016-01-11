import React from 'react';

import Mousetrap from 'mousetrap';

import isEqual from 'lodash/lang/isEqual';

// some day this state should live in a root component that passes down context
// until then, #yolo
const globalHandlers = new Map();
const combos = new Set();

function addKey(key) {
  if (combos.has(key)) {
    throw new Error(`attempted to rebound bound key ${key}`);
  }
  combos.add(key);
}

function bindKeyMap(keyMap) {
  Object.keys(keyMap).forEach((name) => {
    const keys = keyMap[name];
    const fn = globalHandlers.get(name);

    if (Array.isArray(keys)) {
      keys.forEach(addKey);
    } else {
      addKey(keys);
    }

    Mousetrap.bind(keys, fn);
  });
}

function unbindKeyMap(keyMap) {
  Object.values(keyMap).forEach((keys) => {
    if (Array.isArray(keys)) {
      for (let key of keys) {
        combos.delete(key);
      }
    } else {
      combos.delete(keys);
    }

    Mousetrap.unbind(keys);
  });
}

function setHandlers(handlers) {
  Object.keys(handlers).forEach((name) => {
    const handler = handlers[name];

    if (globalHandlers.has(name)) {
      throw new Error(`trying to set handler named ${name} but one already exists`);
    }

    globalHandlers.set(name, handler);
  });
}

function removeHandlers(handlers) {
  Object.keys(handlers).forEach((name) => {
    globalHandlers.delete(name);
  });
}

/*
 * Component that binds keys to a global keypress handler on mount and unbinds on unmount. Can be
 * nested.
 *
 * Note: we use global Mousetrap here instead of an instance of it because an instance would
 * trigger hotkeys inside of a child textarea or input of the parent
 *
 * see https://craig.is/killing/mice#wrapping
 */
const GlobalHotKeys = React.createClass({
  propTypes: {
    handlers: React.PropTypes.object.isRequired,
    keyMap: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired
  },

  componentDidMount() {
    setHandlers(this.props.handlers);
    bindKeyMap(this.props.keyMap);
  },

  componentWillUnmount() {
    removeHandlers(this.props.handlers);
    unbindKeyMap(this.props.keyMap);
  },

  componentDidUpdate(prevProps) {
    // XXX: don't support changing handlers atm... handlers get redefined due to repeated
    // getHandlers() calls which causes fn equality to ofc not work
    //
    // if (!isEqual(prevProps.handlers, this.props.handlers)) {
    //   // remove existing handlers
    //   removeHandlers(prevProps.handlers);
    //   // bind new handlers
    //   setHandlers(this.props.handlers);
    // }

    if (!isEqual(prevProps.keyMap, this.props.keyMap)) {
      unbindKeyMap(prevProps.keyMap);
      bindKeyMap(this.props.keyMap);
    }
  },

  render() {
    return this.props.children;
  }
});

export default GlobalHotKeys;
