'use strict';

let input = '';

/**
 * Calculates the harmonic number H(topNumber) - H(bottomNumber).
 * @param {number} topNumber - A natural number representing the top of the range
 * @param {number} bottomNumber - A natural number representing the bottom of the range
 * @returns {number} - The harmonic number H(topNumber) - H(bottomNumber)
 */
const harmonicNumber = (topNumber, bottomNumber) => {
  let sum = 0;
  for (let i = bottomNumber + 1; i <= topNumber; i++) {
    sum += 1 / i;
  }
  return sum;
};

/**
 * Main program.
 * @returns {void}
 */
const main = () => {
  const tokens = input.trim().split(/\s+/).map(Number);
  let index = 0;

  while (index + 1 < tokens.length) {
    const topNumber = tokens[index++];
    const bottomNumber = tokens[index++];

    const result = harmonicNumber(topNumber, bottomNumber);
    process.stdout.write(result.toFixed(10) + '\n');
  }
};

process.stdin.on('data', (data) => {
  input += data;
});

process.stdin.on('end', main);
