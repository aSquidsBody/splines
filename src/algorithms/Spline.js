import { zeros, ones, lusolve, squeeze, matrix } from "mathjs";

export const cubicRows = (x) => {
  // x is a mathjs matrix
  const xArray = x.valueOf();
  const N = xArray.length;

  const rows = zeros(4 * (N - 1)).map((o, rowIdx) => {
    let row;
    let offset;
    let modRowIdx;

    if (rowIdx[0] < N - 1) {
      offset = rowIdx * 4;

      row = zeros(4 * (N - 1)).map((o, colIdx) => {
        if (colIdx[0] === offset) return 1;
        else if (colIdx[0] === offset + 1) return xArray[rowIdx[0]];
        else if (colIdx[0] === offset + 2) return xArray[rowIdx[0]] ** 2;
        else if (colIdx[0] === offset + 3) return xArray[rowIdx[0]] ** 3;
        else return 0;
      });
    } else if (rowIdx[0] < 2 * (N - 1)) {
      modRowIdx = rowIdx[0] - (N - 1);
      offset = 4 * modRowIdx;

      row = zeros(4 * (N - 1)).map((o, colIdx) => {
        if (colIdx[0] === offset) return 1;
        else if (colIdx[0] === offset + 1) return xArray[modRowIdx + 1];
        else if (colIdx[0] === offset + 2) return xArray[modRowIdx + 1] ** 2;
        else if (colIdx[0] === offset + 3) return xArray[modRowIdx + 1] ** 3;
        else return 0;
      });
    } else if (rowIdx[0] < 2 * (N - 1) + (N - 2)) {
      modRowIdx = rowIdx[0] - 2 * (N - 1) + 1;
      offset = 4 * modRowIdx;

      row = zeros(4 * (N - 1)).map((o, colIdx) => {
        if (colIdx[0] === offset - 4) return 0;
        else if (colIdx[0] === offset - 4 + 1) return -1;
        else if (colIdx[0] === offset - 4 + 2) return -2 * xArray[modRowIdx];
        else if (colIdx[0] === offset - 4 + 3)
          return -3 * xArray[modRowIdx] ** 2;
        else if (colIdx[0] === offset) return 0;
        else if (colIdx[0] === offset + 1) return 1;
        else if (colIdx[0] === offset + 2) return 2 * xArray[modRowIdx];
        else if (colIdx[0] === offset + 3) return 3 * xArray[modRowIdx] ** 2;
        else return 0;
      });
    } else if (rowIdx[0] < 2 * (N - 1) + 2 * (N - 2)) {
      modRowIdx = rowIdx[0] - 2 * (N - 1) - (N - 2) + 1;
      offset = 4 * modRowIdx;

      row = zeros(4 * (N - 1)).map((o, colIdx) => {
        if (colIdx[0] === offset - 4) return 0;
        else if (colIdx[0] === offset - 4 + 1) return 0;
        else if (colIdx[0] === offset - 4 + 2) return -2;
        else if (colIdx[0] === offset - 4 + 3) return -6 * xArray[modRowIdx];
        else if (colIdx[0] === offset) return 0;
        else if (colIdx[0] === offset + 1) return 0;
        else if (colIdx[0] === offset + 2) return 2;
        else if (colIdx[0] === offset + 3) return 6 * xArray[modRowIdx];
        else return 0;
      });
    } else if (rowIdx[0] === 2 * (N - 1) + 2 * (N - 2)) {
      row = zeros(4 * (N - 1)).map((o, colIdx) => {
        if (colIdx[0] === 0) return 0;
        else if (colIdx[0] === 1) return 0;
        else if (colIdx[0] === 2) return 2;
        else if (colIdx[0] === 3) return 6 * xArray[0];
        else return 0;
      });
    } else {
      row = zeros(4 * (N - 1)).map((o, colIdx) => {
        if (colIdx[0] === 4 * (N - 1) - 4) return 0;
        else if (colIdx[0] === 4 * (N - 1) - 3) return 0;
        else if (colIdx[0] === 4 * (N - 1) - 2) return -2;
        else if (colIdx[0] === 4 * (N - 1) - 1) return -6 * xArray[N - 1];
        else return 0;
      });
    }
    return row;
  });

  return rows;
};

export const cubicCol = (y) => {
  // y is a mathjs matrix
  const yArray = y.valueOf();
  const N = yArray.length;

  const col = ones(4 * (N - 1)).map((o, idx) => {
    let colVal;
    if (idx < N - 1) {
      colVal = yArray[idx];
    } else if (idx < 2 * (N - 1)) {
      colVal = yArray[idx - (N - 1) + 1];
    } else {
      colVal = 0;
    }

    return colVal;
  });

  return col;
};

export const splineCoeffs = (x, y) => {
  const A = cubicRows(x);
  const b = cubicCol(y);

  const coeffs = squeeze(lusolve(A, b)).valueOf();

  return coeffs;
};

const cube = (a, b, c, d) => (x) => {
  return a + b * x + c * x ** 2 + d * x ** 3;
};

export const spline = (points) => {
  const xArray = points.map((point) => point.coords[0]);
  const yArray = points.map((point) => point.coords[1]);

  var xyPoints = ones(xArray.length)
    .map((xi, idx) => {
      return [xArray[idx], yArray[idx]];
    })
    .valueOf();

  xyPoints.sort((xy1, xy2) => {
    return xy1[0] - xy2[0];
  });

  const sortedX = matrix(xyPoints.map((xy) => xy[0]));
  const sortedXArray = sortedX.valueOf();
  const sortedY = matrix(xyPoints.map((xy) => xy[1]));

  const coeffs = splineCoeffs(sortedX, sortedY).valueOf();

  const cubicSplines = sortedXArray
    .slice(0, sortedXArray.length - 1)
    .map((o, idx) => {
      const offset = 4 * idx;
      const a = coeffs[offset];
      const b = coeffs[offset + 1];
      const c = coeffs[offset + 2];
      const d = coeffs[offset + 3];
      return cube(a, b, c, d);
    });

  const splineFunction = (xInput) => {
    var returnVal = null;

    sortedXArray.slice(0, sortedXArray.length - 1).forEach((xi, idx) => {
      const xip1 = sortedXArray[idx + 1];

      if (xi <= xInput && xInput < xip1) {
        const cubicFunc = cubicSplines[idx];
        returnVal = cubicFunc(xInput);
      }
    });

    return returnVal;
  };

  return splineFunction;
};
