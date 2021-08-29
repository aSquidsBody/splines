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

export const regressionCoefficients = (xData, yData, degree) => {
  const polynomials = getMatrix(xData, degree);

  const MTM = math.multiply(math.transpose(polynomials), polynomials);
  const yM = getColumn(yData, polynomials);

  const coefficients = math.squeeze(math.lusolve(MTM, yM)).valueOf();

  return coefficients;
};

export const regression = (points, degree) => {
  // x & y data as mathjs arrays
  const xData = math
    .ones(points.length)
    .map((val, idx) => points[idx].coords[0]);
  const yData = math
    .ones(points.length)
    .map((val, idx) => points[idx].coords[1]);

  if (points.length > degree) {
    const coeffs = regressionCoefficients(xData, yData, degree);
    return regressionPolynomial(coeffs);
  }
};

export var regressionPolynomial = (coeffs) => (x) => {
  var y = 0;
  coeffs.forEach((coeff, idx) => {
    const power = coeffs.length - 1 - idx;
    y = y + coeff * x ** power;
  });
  return y;
};
