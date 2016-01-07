export const judgements = [
  // window (ms), label, continue combo (true) or break (false)
  { threshold: 50, label: 'Perfect', keepCombo: true, hp: 4 },
  { threshold: 100, label: 'Great', keepCombo: true, hp: 2 },
  { threshold: 135, label: 'Decent', keepCombo: true, hp: 1 },
  { threshold: 180, label: 'Way Off', keepCombo: false, hp: -2 },
];

export const missedJudgement = {
  label: 'Miss',
  keepCombo: false,
  hp: -6,
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
