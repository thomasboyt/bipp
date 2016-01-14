export const judgements = [
  // window (ms), label, continue combo (true) or break (false)
  { threshold: 50, label: 'Perfect', className: 'perfect', keepCombo: true, hp: 4 },
  { threshold: 100, label: 'Great', className: 'great', keepCombo: true, hp: 2 },
  { threshold: 135, label: 'Decent', className: 'decent', keepCombo: true, hp: 1 },
  { threshold: 180, label: 'Way Off', className: 'way-off', keepCombo: false, hp: -2 },
];

export const missedJudgement = {
  label: 'Miss',
  className: 'miss',
  keepCombo: false,
  hp: -6,
};

// Map keyCodes to columns
export const keyCodeColMap = {
  '83': 0,
  '68': 1,
  '70': 2,
  '32': 3,
  '74': 4,
  '75': 5,
  '76': 6
};

// Map keys (as seen by Mousetrap) to columns
export const keyColMap = {
  's': 0,
  'd': 1,
  'f': 2,
  'space': 3,
  'j': 4,
  'k': 5,
  'l': 6
};

// [fill, stroke]
const editorColors = {
  color1: ['white', 'black'],
  color2: ['rgb(255,0,255)', 'black'],
  centerColor: ['red', 'black'],
  separatorStyle: 'rgba(0,0,0,0)',
  beatLineStyle: 'black',
  offsetBarFillStyle: '#4A90E2',
};

const playerColors = {
  color1: ['white', 'rgba(0,0,0,0)'],
  color2: ['rgb(255,0,255)', 'rgba(0,0,0,0)'],
  centerColor: ['red', 'rgba(0,0,0,0)'],
  separatorStyle: 'white',
  beatLineStyle: 'rgba(0,0,0,0)',
  offsetBarFillStyle: '#4A90E2',
};

[editorColors, playerColors].forEach((colors) => {
  const {color1, color2, centerColor} = colors;

  colors.noteColors = [
    color1, color2, color1, centerColor, color1, color2, color1
  ];
});

export {playerColors, editorColors};
