const fs = require('fs');

const filename = process.argv[2];

const chartData = JSON.parse(fs.readFileSync(filename, {encoding: 'utf8'}));

chartData.notes.forEach((note) => {
  note.totalOffset = note.offset + note.beat * 24;
  delete note.offset;
  delete note.beat;
});

fs.writeFileSync(filename, JSON.stringify(chartData), {encoding: 'utf8'});
