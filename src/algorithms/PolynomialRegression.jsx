const math = require("mathjs");

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

export default regression;
