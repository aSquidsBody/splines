const { range } = require("mathjs");

// Coordinate transforms
export const xPixel2Coord = (xPixel, ctx, axes) => {
  return (
    ((axes.xRangeCoords[1] - axes.xRangeCoords[0]) * xPixel) /
      ctx.canvas.width +
    axes.xRangeCoords[0]
  );
};

export const yPixel2Coord = (yPixel, ctx, axes) => {
  return (
    ((axes.yRangeCoords[0] - axes.yRangeCoords[1]) * yPixel) /
      ctx.canvas.height +
    axes.yRangeCoords[1]
  );
};

export const xCoord2Pixel = (xCoord, ctx, axes) => {
  return (
    ((xCoord - axes.xRangeCoords[0]) * ctx.canvas.width) /
    (axes.xRangeCoords[1] - axes.xRangeCoords[0])
  );
};

export const yCoord2Pixel = (yCoord, ctx, axes) => {
  return (
    ((yCoord - axes.yRangeCoords[1]) * ctx.canvas.height) /
    (axes.yRangeCoords[0] - axes.yRangeCoords[1])
  );
};

export const pixel2coord = (xPixel, yPixel, ctx, axes) => {
  // convert the x
  const x = this.xPixel2Coord(xPixel, ctx, axes);

  // convert the y
  const y = this.yPixel2Coord(yPixel, ctx, axes);

  return { x, y };
};

export const coord2pixel = (xCoord, yCoord, ctx, axes) => {
  // convert the x
  const x = xCoord2Pixel(xCoord, ctx, axes);

  // convert the y
  const y = yCoord2Pixel(yCoord, ctx, axes);

  return { x, y };
};

// Draw the axes
export const plotAxes = (ctx, axes) => {
  const originXPixel = Math.max(
    Math.min(xCoord2Pixel(0.0, ctx, axes), ctx.canvas.width),
    0
  ); // mod it to be in the canvas
  const originYPixel = Math.max(
    Math.min(yCoord2Pixel(0.0, ctx, axes), ctx.canvas.height),
    0
  );

  ctx.beginPath();
  ctx.lineWidth = axes.thickness;
  ctx.strokeStyle = "rgb(0, 0, 0)";

  // x-axis
  ctx.moveTo(0, originYPixel);
  ctx.lineTo(ctx.canvas.width, originYPixel);

  // y-axis
  ctx.moveTo(originXPixel, ctx.canvas.height); // y == height is the bottom
  ctx.lineTo(originXPixel, 0); // y == 0 is the top

  ctx.closePath();
  ctx.stroke();
};

// Plot the ticks on axes
export const plotTicks = (ctx, axes) => {
  // Add the ticks
  ctx.beginPath();
  ctx.lineWidth = 1;

  const originXPixel = Math.max(
    Math.min(xCoord2Pixel(0.0, ctx, axes), ctx.canvas.width),
    0
  ); // mod it to be in the canvas
  const originYPixel = Math.max(
    Math.min(yCoord2Pixel(0.0, ctx, axes), ctx.canvas.height),
    0
  );

  // Compute the x-axis tick scale
  const xRange = axes.xRangeCoords[1] - axes.xRangeCoords[0];
  const xScale = Math.floor(Math.log(xRange) / Math.log(5)) - 1;
  const xTick = 5 ** xScale;

  var lowerMod = axes.xRangeCoords[0] % xTick;
  lowerMod = lowerMod <= 0 ? lowerMod : lowerMod;
  const lowerX = axes.xRangeCoords[0] - lowerMod;

  var higherMod = axes.xRangeCoords[1] % xTick;
  higherMod = higherMod >= 0 ? higherMod : xTick + higherMod;
  const higherX = axes.xRangeCoords[1] - higherMod;

  // Define the x-ticks
  const tickXCoords = range(lowerX, higherX + xTick, xTick);

  const tickXPixels = tickXCoords.map((xCoord) =>
    xCoord2Pixel(xCoord, ctx, axes)
  );

  // Draw the x-ticks
  tickXPixels.forEach((xPixel, idx) => {
    const lowerYPixel = Math.min(originYPixel + 5, ctx.canvas.height);
    const upperYPixel = Math.max(originYPixel - 5, 0);

    ctx.moveTo(xPixel, lowerYPixel);
    ctx.lineTo(xPixel, upperYPixel);

    // Set up the label
    ctx.font = "1rem Urbanist";
    const labelNumber = tickXCoords.valueOf()[idx];
    const label =
      xScale < -2 || xScale > 2
        ? labelNumber.toExponential(1).toString()
        : labelNumber.toFixed(2).toString();

    const leftOffset = ctx.measureText(label).width / 2;

    if (label !== "0") {
      if (lowerYPixel + 15 > ctx.canvas.height) {
        ctx.fillText(label, xPixel - leftOffset, upperYPixel - 5);
      } else {
        ctx.fillText(label, xPixel - leftOffset, lowerYPixel + 15);
      }
    }
  });

  // Compute the y-axis tick scale
  const yRange = axes.yRangeCoords[1] - axes.yRangeCoords[0];
  const yScale = Math.floor(Math.log(yRange) / Math.log(5)) - 1;
  const yTick = 5 ** yScale;

  lowerMod = axes.yRangeCoords[0] % yTick;
  lowerMod = lowerMod <= 0 ? lowerMod : lowerMod;
  const lowerY = axes.yRangeCoords[0] - lowerMod;

  higherMod = axes.yRangeCoords[1] % yTick;
  higherMod = higherMod >= 0 ? higherMod : yTick + higherMod;
  const higherY = axes.yRangeCoords[1] - higherMod;

  // Define the y-ticks
  const tickYCoords = range(lowerY, higherY + yTick, yTick);

  const tickYPixels = tickYCoords.map((yCoord) =>
    yCoord2Pixel(yCoord, ctx, axes)
  );

  // Draw the y-ticks
  tickYPixels.forEach((yPixel, idx) => {
    const leftXPixel = Math.max(originXPixel - 5, 0);
    const rightXPixel = Math.min(originXPixel + 5, ctx.canvas.width);

    ctx.moveTo(leftXPixel, yPixel);
    ctx.lineTo(rightXPixel, yPixel);

    // Set up the label
    ctx.font = "1rem Urbanist";
    const labelNumber = tickYCoords.valueOf()[idx];
    const label =
      yScale < -2 || yScale > 2
        ? labelNumber.toExponential(1).toString()
        : labelNumber.toFixed(2).toString();

    const leftOffset = ctx.measureText(label).width + 5;
    if (label !== "0") {
      if (leftXPixel - leftOffset <= 0) {
        ctx.fillText(label, rightXPixel + 5, yPixel + 5);
      } else {
        ctx.fillText(label, leftXPixel - leftOffset, yPixel + 5);
      }
    }
  });

  ctx.closePath();
  ctx.stroke();
};

export const plotPoints = (ctx, axes, points) => {
  points.forEach((point) => {
    // Get the point state and element
    const pointElmnt = point.ref.current;

    // Get the coordinates of the point
    const xCoord = point.coords[0];
    const yCoord = point.coords[1];

    // convert to pixels
    const xPixel = xCoord2Pixel(xCoord, ctx, axes) - 0.5 * point.diameter;
    const yPixel = yCoord2Pixel(yCoord, ctx, axes) - 0.5 * point.diameter;

    // If the point is in the
    if (inView(xCoord, yCoord, axes)) {
      pointElmnt.style.top = yPixel.toString() + "px";
      pointElmnt.style.left = xPixel.toString() + "px";
      pointElmnt.style.visibility = "visible";
    } else {
      pointElmnt.style.visibility = "hidden";
    }
  });
};

export const plotFunction = (ctx, axes, func) => {
  const dx = 0.25;

  ctx.beginPath();

  // we will be drawing small lines between points (linear interp) to produce the picture
  ctx.lineWidth = axes.thickness;
  ctx.strokeStyle = "rgb(0, 0, 255)";

  const numInterp = Math.floor(ctx.canvas.width / dx);
  const interpXs = range(dx, (numInterp + 1) * dx, dx); // xPixels

  var prevXPixel = 0;
  var prevXCoord = xPixel2Coord(prevXPixel, ctx, axes);
  var prevYCoord = func(prevXCoord);
  var prevYPixel = yCoord2Pixel(prevYCoord, ctx, axes);

  interpXs.forEach((currentX) => {
    // Get the pixel values for the function point
    const xPixel = currentX;
    const xCoord = xPixel2Coord(xPixel, ctx, axes);

    const yCoord = func(xCoord);

    const yPixel = yCoord2Pixel(yCoord, ctx, axes);

    // Draw the interpolating line
    if (yCoord !== null && prevYCoord !== null) {
      ctx.moveTo(prevXPixel, prevYPixel);
      ctx.lineTo(xPixel, yPixel);
    }

    // Reset the "previous" values
    prevXPixel = xPixel;
    prevXCoord = xCoord;
    prevYCoord = yCoord;
    prevYPixel = yPixel;
  });
  ctx.closePath();
  ctx.stroke();
};

export const inView = (x, y, axes) => {
  // Return true if the x,y point is in the x/y ranges of the axes
  return (
    axes.xRangeCoords[0] < x &&
    x < axes.xRangeCoords[1] &&
    axes.yRangeCoords[0] < y &&
    y < axes.yRangeCoords[1]
  );
};
