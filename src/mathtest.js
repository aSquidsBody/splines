const math = require("mathjs");

const matrix = math.matrix([
  [1, 1],
  [-1, 1],
]);

const b = [1, 1];

// test looping through a matrix
const testMatrix = math
  .matrix([1, 2, 3])
  .map((xi) => math.matrix([1, xi, xi ** 2]));

const getMatrix = (xData, degree) =>
  xData.map((xi) =>
    math
      .ones(degree + 1)
      .map((rowElem, rowIndex) =>
        math.squeeze(rowIndex) === degree ? 1 : xi ** (degree - rowIndex)
      )
  );

const getColumn = (yData, matrix) => math.multiply(yData, matrix);

const regression = (xData, yData, degree) => {
  const polynomials = getMatrix(xData, degree);

  const MTM = math.multiply(math.transpose(polynomials), polynomials);
  const yM = getColumn(yData, polynomials);

  const coefficients = math.squeeze(math.lusolve(MTM, yM)).valueOf();

  return coefficients;
};

// test the regression
// generate random data
const interval = [0, 10];
const numPoints = 20;
const degree = 4;
const f = (x) =>
  10 * math.sin((2 * Math.PI * x) / (interval[1] - interval[0])) ** 2;
const yNoise = 0.3;

const xData = math.sort(
  math.ones(numPoints).map(() => math.random(interval[0], interval[1]))
);

const yData = xData.map((xi) => f(xi) + math.random(-yNoise, yNoise));

console.time("regression");
regression(xData, yData, degree);
console.timeEnd("regression");

exports.default = regression;
