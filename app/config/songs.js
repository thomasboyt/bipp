// This loads every file matching `../../songs/*/index.js`

const req = require.context('../../songs', true, /\/index.js$/);

const songs = req.keys().map((key) => {
  return req(key).default;
});

export default songs;
