import qs from 'qs';

// TODO: if we're in a test mode it'd be nice not to have to set document.location.search... pull
// from global or something instead?
const qsObj = qs.parse(document.location.search.slice(1));  // lop off leading question mark

const types = {
  bool(value, name) {
    // this is a bool
    if (value === '') {
      return true;
    } else if (value === '0' || value === 'false') {
      return false;
    } else if (value === '1' || value === 'true') {
      return true;
    } else {
      throw new Error(`could not parse boolean flag ${name}`);
    }
  }
};

function getFlag(name, type, defaultValue) {
  if (qsObj[name] !== undefined) {
    return type(qsObj[name], name);
  } else {
    return defaultValue;
  }
}

export const ENABLE_YT_PLAYBACK = getFlag('enableyt', types.bool, false);
export const ENABLE_CANVAS_PLAYBACK = getFlag('canvas', types.bool, true);

// TODO: remove once SVG Chart is removed
export const ENABLE_3D_ACCEL = getFlag('enable3daccel', types.bool, false);

export const MUTE = getFlag('mute', types.bool, false);

export const SHOW_FPS = getFlag('fps', types.bool, false);
