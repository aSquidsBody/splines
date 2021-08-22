import React, { Component } from "react";
import { range } from "mathjs";

class Plot extends Component {
  state = {
    points: ["point1", "point2", "point3"],
    point1: {
      id: "point1",
      pos: [0, 0, 0, 0],
    },
    point2: {
      id: "point2",
      pos: [0, 0, 0, 0],
    },
    point3: {
      id: "point3",
      pos: [0, 0, 0, 0],
    },

    boxwidth: 0,
    boxHeight: 0,
    dotDiameter: 10,
    selected: null,
    canvasRef: React.createRef(),
    axes: {
      scale: 100,
      thickness: 3,
      xRangeCoords: [-5, 5],
      yRangeCoords: [-5, 5],
    },
  };

  componentDidMount() {
    this.resize();

    this.state.points.forEach((pointId) => {
      this.dragElement(document.getElementById(pointId));
    });

    // Listen for resizing of the page
    window.addEventListener("resize", this.resize);
  }

  resize = () => {
    const boxHeight = parseInt(
      window
        .getComputedStyle(document.getElementById("plot"))
        .getPropertyValue("height")
        .slice(0, -2)
    );

    const boxWidth = parseInt(
      window
        .getComputedStyle(document.getElementById("plot"))
        .getPropertyValue("width")
        .slice(0, -2)
    );

    this.setState({
      boxHeight,
      boxWidth,
    });

    const canvas = this.state.canvasRef.current;
    if (canvas) {
      if (null === canvas || !canvas.getContext) return;

      // Add eventlistener for zooming
      canvas.onwheel = this.zoom;

      canvas.height = boxHeight;
      canvas.width = boxWidth;
      this.draw(canvas);
    }
  };

  // Method to define elements as drag elements
  dragElement = (elmnt) => {
    elmnt.onmousedown = this.dragMouseDown;
  };

  // Method to handle mouse down on a drag element (e is event)
  dragMouseDown = (e) => {
    e = e || window.event;
    e.preventDefault(); // prevent the default behavior

    let elementId;
    if (this.state.selected === null) {
      elementId = e.srcElement.id;

      this.setState({
        selected: elementId,
      });
    } else {
      elementId = this.state.selected;
    }

    // Get the point which is being dragged
    // update the mouse cursor position at the start
    const point = this.state[elementId];

    point.pos[2] = e.clientX;
    point.pos[3] = e.clientY;

    this.setState({
      [point.id]: point,
    });

    // set the mouse up function
    document.onmouseup = this.closeDragElement;

    // call a function whenever the cursor moves
    document.onmousemove = this.elementDrag;
  };

  // Method to move an element
  elementDrag = (e) => {
    e = e || window.event;
    e.preventDefault();

    const elementId = this.state.selected;

    const elmnt = document.getElementById(elementId);

    // set the cursor style
    elmnt.style.cursor = "move";

    // get the point and calculate it's new position
    const point = this.state[elementId];

    // const point = points.find((pt) => pt.id === elementId);
    const startX = point.pos[2];
    const startY = point.pos[3];

    const difX = startX - e.clientX;
    const difY = startY - e.clientY;
    const newX = e.clientX;
    const newY = e.clientY;

    // Values to be saved in state
    point.pos = [difX, difY, newX, newY];

    // set the element's new position
    const newTop = elmnt.offsetTop - difY;
    const newLeft = elmnt.offsetLeft - difX;

    if (newTop < 0) {
      elmnt.style.top = "0px";
    } else if (this.state.boxHeight - this.state.dotDiameter < newTop) {
      elmnt.style.top = this.state.boxHeight - this.state.dotDiameter + "px";
    } else {
      elmnt.style.top = newTop + "px";
    }

    if (newLeft < 0) {
      elmnt.style.left = "0px";
    } else if (this.state.boxWidth - this.state.dotDiameter < newLeft) {
      elmnt.style.left = this.state.boxWidth - this.state.dotDiameter + "px";
    } else {
      elmnt.style.left = newLeft + "px";
    }

    this.setState({
      [point.id]: point,
    });
  };

  closeDragElement = () => {
    const elmnt = document.getElementById(this.state.selected);
    elmnt.style.cursor = "pointer";

    this.setState({
      selected: null,
    });
    document.onmouseup = null;
    document.onmousemove = null;
  };

  // Method to handle the zooming in the plot
  zoom = (e) => {
    e = e || window.event;
    e.preventDefault();

    const zoomScale = e.deltaY * -0.014;

    if (zoomScale < 0) {
      const axes = this.state.axes;
      const deltaXRange =
        (axes.xRangeCoords[1] - axes.xRangeCoords[0]) *
        (Math.abs(zoomScale) - 1);
      const deltaYRange =
        (axes.yRangeCoords[1] - axes.yRangeCoords[0]) *
        (Math.abs(zoomScale) - 1);

      axes.xRangeCoords[0] = Math.max(
        axes.xRangeCoords[0] - 0.5 * deltaXRange,
        -100
      );
      axes.xRangeCoords[1] = Math.min(
        axes.xRangeCoords[1] + 0.5 * deltaXRange,
        100
      );

      axes.yRangeCoords[0] = Math.max(
        axes.yRangeCoords[0] - 0.5 * deltaYRange,
        -100
      );
      axes.yRangeCoords[1] = Math.min(
        axes.yRangeCoords[1] + 0.5 * deltaYRange,
        100
      );

      this.setState({
        axes,
      });

      const canvas = this.state.canvasRef.current;
      if (canvas) {
        this.draw(canvas);
      }
    } else {
      const axes = this.state.axes;
      const deltaXRange =
        (axes.xRangeCoords[1] - axes.xRangeCoords[0]) * (zoomScale - 1);
      const deltaYRange =
        (axes.yRangeCoords[1] - axes.yRangeCoords[0]) * (zoomScale - 1);

      axes.xRangeCoords[0] = Math.max(
        axes.xRangeCoords[0] + 0.5 * deltaXRange,
        -100
      );
      axes.xRangeCoords[1] = Math.min(
        axes.xRangeCoords[1] - 0.5 * deltaXRange,
        100
      );

      axes.yRangeCoords[0] = Math.max(
        axes.yRangeCoords[0] + 0.5 * deltaYRange,
        -100
      );
      axes.yRangeCoords[1] = Math.min(
        axes.yRangeCoords[1] - 0.5 * deltaYRange,
        100
      );

      this.setState({
        axes,
      });

      const canvas = this.state.canvasRef.current;
      if (canvas) {
        this.draw(canvas);
      }
    }
  };

  // Method to handle the panning of the plot
  pan = (e) => {
    e = e || window.event;
    e.preventDefault();
  };

  sinFunction = (x) => 5 * Math.sin(x);

  draw = (canvas) => {
    var ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.showAxes(ctx, this.state.axes);
    this.funGraph(ctx, this.state.axes, this.sinFunction, "rgb(0, 0, 0)");
  };

  xPixel2Coord = (xPixel, ctx, axes) => {
    return (
      ((axes.xRangeCoords[1] - axes.xRangeCoords[0]) * xPixel) /
        ctx.canvas.width +
      axes.xRangeCoords[0]
    );
  };

  yPixel2Coord = (yPixel, ctx, axes) => {
    return (
      ((axes.yRangeCoords[0] - axes.yRangeCoords[1]) * yPixel) /
        ctx.canvas.height +
      axes.yRangeCoords[1]
    );
  };

  xCoord2Pixel = (xCoord, ctx, axes) => {
    return (
      ((xCoord - axes.xRangeCoords[0]) * ctx.canvas.width) /
      (axes.xRangeCoords[1] - axes.xRangeCoords[0])
    );
  };

  yCoord2Pixel = (yCoord, ctx, axes) => {
    return (
      ((yCoord - axes.yRangeCoords[1]) * ctx.canvas.height) /
      (axes.yRangeCoords[0] - axes.yRangeCoords[1])
    );
  };

  pixel2coord = (xPixel, yPixel, ctx, axes) => {
    // convert the x
    const x = this.xPixel2Coord(xPixel, ctx, axes);

    // convert the y
    const y = this.yPixel2Coord(yPixel, ctx, axes);

    return { x, y };
  };

  coord2pixel = (xCoord, yCoord, ctx, axes) => {
    // convert the x
    const x = this.xCoord2Pixel(xCoord, ctx, axes);

    // convert the y
    const y = this.yCoord2Pixel(yCoord, ctx, axes);

    return { x, y };
  };

  funGraph = (ctx, axes, func, color) => {
    const dx = 4;

    ctx.beginPath();

    // we will be drawing small lines between points (linear interp) to produce the picture
    ctx.lineWidth = axes.thickness;
    ctx.strokeStyle = color;

    const numInterp = Math.floor(ctx.canvas.width / dx);
    const interpXs = range(dx, (numInterp + 1) * dx, dx); // xPixels

    var prevXPixel = 0;
    var prevXCoord = this.xPixel2Coord(prevXPixel, ctx, axes);
    var prevYCoord = func(prevXCoord);
    var prevYPixel = this.yCoord2Pixel(prevYCoord, ctx, axes);

    interpXs.forEach((currentX) => {
      // Get the pixel values for the function point
      const xPixel = currentX;
      const xCoord = this.xPixel2Coord(xPixel, ctx, axes);

      const yCoord = func(xCoord);
      const yPixel = this.yCoord2Pixel(yCoord, ctx, axes);

      // Draw the interpolating line
      ctx.moveTo(prevXPixel, prevYPixel);
      ctx.lineTo(xPixel, yPixel);

      // Reset the "previous" values
      prevXPixel = xPixel;
      prevXCoord = xCoord;
      prevYCoord = yCoord;
      prevYPixel = yPixel;
    });
    ctx.closePath();
    ctx.stroke();
  };

  showAxes = (ctx, axes) => {
    const originXPixel = Math.max(
      Math.min(this.xCoord2Pixel(0.0, ctx, axes), ctx.canvas.width),
      0
    ); // mod it to be in the canvas
    const originYPixel = Math.max(
      Math.min(this.yCoord2Pixel(0.0, ctx, axes), ctx.canvas.height),
      0
    );

    // Draw the axes
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

    // Add the ticks
    ctx.beginPath();
    ctx.lineWidth = 1;

    // Define the x-ticks
    const tickXCoords = range(
      Math.floor(axes.xRangeCoords[0] + 1),
      Math.floor(axes.xRangeCoords[1] + 1)
    );
    const tickXPixels = tickXCoords.map((xCoord) =>
      this.xCoord2Pixel(xCoord, ctx, axes)
    );

    // Draw the x-ticks
    tickXPixels.forEach((xPixel, idx) => {
      const lowerYPixel = Math.min(originYPixel + 5, ctx.canvas.height);
      const upperYPixel = Math.max(originYPixel - 5, 0);

      ctx.moveTo(xPixel, lowerYPixel);
      ctx.lineTo(xPixel, upperYPixel);

      // Set up the label
      ctx.font = "1rem Urbanist";
      const label = tickXCoords.valueOf()[idx].toString();
      const leftOffset = ctx.measureText(label).width / 2;

      if (lowerYPixel + 15 > ctx.canvas.height) {
        ctx.fillText(label, xPixel - leftOffset, upperYPixel - 5);
      } else {
        ctx.fillText(label, xPixel - leftOffset, lowerYPixel + 15);
      }
    });

    // Define the y-ticks
    const tickYCoords = range(
      Math.floor(axes.yRangeCoords[0] + 1),
      Math.floor(axes.yRangeCoords[1] + 1)
    );
    const tickYPixels = tickYCoords.map((yCoord) =>
      this.yCoord2Pixel(yCoord, ctx, axes)
    );

    // Draw the y-ticks
    tickYPixels.forEach((yPixel, idx) => {
      const leftXPixel = Math.max(originXPixel - 5, 0);
      const rightXPixel = Math.min(originXPixel + 5, ctx.canvas.width);

      ctx.moveTo(leftXPixel, yPixel);
      ctx.lineTo(rightXPixel, yPixel);

      // Set up the label
      ctx.font = "1rem Urbanist";
      const label = tickYCoords.valueOf()[idx].toString();
      const leftOffset = ctx.measureText(label).width + 5;

      if (leftXPixel - leftOffset <= 0) {
        ctx.fillText(label, rightXPixel + 5, yPixel + 5);
      } else {
        ctx.fillText(label, leftXPixel - leftOffset, yPixel + 5);
      }
    });

    ctx.closePath();
    ctx.stroke();
  };

  render() {
    const documentWidth = window.innerWidth;
    const documentHeight = window.innerHeight;

    return (
      <div id="plot" className="plot">
        <canvas
          id="canvas"
          height={documentHeight.toString() + "px"}
          width={documentWidth.toString() + "px"}
          className="canvas"
          ref={this.state.canvasRef}
        ></canvas>
        {Object.values(this.state.points).map((pointId) => {
          return (
            <div id={pointId} key={pointId} className="dot">
              <p className="coord"></p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Plot;
