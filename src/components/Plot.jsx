import React, { Component } from "react";
import {
  plotTicks,
  plotAxes,
  plotPoints,
  plotFunction,
  xPixel2Coord,
  yPixel2Coord,
  xCoord2Pixel,
  yCoord2Pixel,
} from "../utils/plot";
import { regression } from "../algorithms/PolynomialRegression";
import { spline } from "../algorithms/Spline";

class Plot extends Component {
  state = {
    selected: null,
    canvasRef: React.createRef(),
    axes: {
      scale: 100,
      thickness: 3,
      xRangeCoords: [-5, 5],
      yRangeCoords: [(-5 * 588) / 1480, (5 * 588) / 1480],
    },
    mousePan: [0, 0],
  };

  componentDidMount() {
    this.resize(); // Create a plot of the correct size for the window

    // Listen for resizing of the page
    window.addEventListener("resize", this.resize);
  }

  componentDidUpdate() {
    this.props.points.forEach((point) => {
      this.dragElement(point.ref.current);
    });

    this.resize();
  }

  resize = () => {
    // Method to handle the resizing of the window
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
    const canvas = this.state.canvasRef.current;
    if (canvas) {
      if (null === canvas || !canvas.getContext) return;

      // Add eventlistener for zooming
      canvas.onwheel = this.zoom;

      this.panElement(canvas);

      canvas.height = boxHeight;
      canvas.width = boxWidth;
      this.draw(canvas);
    }
  };

  // Method to define elements as drag elements
  dragElement = (elmnt) => {
    elmnt.onmousedown = this.dragMouseDown;
  };

  // Method to define elements as pan elements
  panElement = (elmnt) => {
    elmnt.onmousedown = this.panMouseDown;
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
    const point = this.props.points.find((p) => {
      return p.id === elementId;
    });

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

  panMouseDown = (e) => {
    e = e || window.event;
    e.preventDefault();

    // save the position of the mouse at the beginning of the pan
    this.setState({
      mousePan: [e.clientX, e.clientY],
    });

    document.onmousemove = this.elementPan;
    document.onmouseup = this.closePanElement;
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
    const point = this.props.points.find((pt) => {
      return pt.id === elementId;
    });

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

    const canvas = this.state.canvasRef.current;
    const ctx = canvas.getContext("2d");
    point.coords = [
      xPixel2Coord(newLeft + 0.5 * point.diameter, ctx, this.state.axes),
      yPixel2Coord(newTop + 0.5 * point.diameter, ctx, this.state.axes),
    ];

    this.setState({
      [point.id]: point,
    });

    // Update the coordinates in the object
    this.draw(canvas);
  };

  elementPan = (e) => {
    e = e || window.event;
    e.preventDefault();

    const startX = this.state.mousePan[0];
    const startY = this.state.mousePan[1];
    const difX = startX - e.clientX;
    const difY = startY - e.clientY;

    const axes = this.state.axes;
    const xRange = axes.xRangeCoords[1] - axes.xRangeCoords[0];
    const yRange = axes.yRangeCoords[1] - axes.yRangeCoords[0];
    const pixelHeight = this.state.canvasRef.current.height;
    const pixelWidth = this.state.canvasRef.current.width;

    axes.xRangeCoords[0] = axes.xRangeCoords[0] + difX / (pixelWidth / xRange);
    axes.xRangeCoords[1] = axes.xRangeCoords[1] + difX / (pixelWidth / xRange);
    axes.yRangeCoords[0] = axes.yRangeCoords[0] - difY / (pixelHeight / yRange);
    axes.yRangeCoords[1] = axes.yRangeCoords[1] - difY / (pixelHeight / yRange);

    this.setState({
      axes,
      mousePan: [e.clientX, e.clientY],
    });

    this.draw(this.state.canvasRef.current);
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

  closePanElement = () => {
    this.setState({
      mousePan: [0, 0],
    });
    document.onmouseup = null;
    document.onmousemove = null;
  };

  // Method to handle the zooming in the plot
  zoom = (e) => {
    e = e || window.event;
    e.preventDefault();

    const canvas = this.state.canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (canvas) {
      const axes = this.state.axes;

      const zoomScale = 1 + e.deltaY * 0.0005;

      const oldXRange = axes.xRangeCoords.slice();
      const oldYRange = axes.yRangeCoords.slice();
      const cursorCoords = [
        xPixel2Coord(e.offsetX, ctx, axes),
        yPixel2Coord(e.offsetY, ctx, axes),
      ];

      axes.xRangeCoords[0] =
        cursorCoords[0] - (cursorCoords[0] - oldXRange[0]) * zoomScale;

      axes.xRangeCoords[1] =
        zoomScale * (oldXRange[1] - oldXRange[0]) + axes.xRangeCoords[0];

      axes.yRangeCoords[0] =
        cursorCoords[1] - (cursorCoords[1] - oldYRange[0]) * zoomScale;

      axes.yRangeCoords[1] =
        zoomScale * (oldYRange[1] - oldYRange[0]) + axes.yRangeCoords[0];

      this.setState({
        axes,
      });

      this.draw(canvas);
    }
  };

  draw = (canvas) => {
    var ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the axes and the axis ticks
    plotAxes(ctx, this.state.axes);
    plotTicks(ctx, this.state.axes);

    // Plot the points (elements)
    plotPoints(ctx, this.state.axes, this.props.points);

    if (this.props.plot.type) {
      const splitPlotType = this.props.plot.type.split("+");
      var func = null;

      // If plot type is regression, generate the regression polynomial
      if (splitPlotType[0] === "PolynomialRegression") {
        const degree = parseInt(splitPlotType[1]);

        func = regression(this.props.points, degree);
      } else if (
        splitPlotType[0] === "Spline" &&
        this.props.points.length > 2
      ) {
        func = spline(this.props.points);
      }
    }
    // If there is a plot to draw, draw the plot
    if (func) plotFunction(ctx, this.state.axes, func);
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
        {this.state.canvasRef && Object.values(this.props.points).length > 0
          ? Object.values(this.props.points).map((point, idx) => {
              return (
                <div
                  id={point.id}
                  key={point.id}
                  className="dot"
                  ref={this.props.points[idx].ref}
                  left={
                    xCoord2Pixel(
                      this.props.points[idx].coords[0],
                      this.state.canvasRef.current.getContext("2d"),
                      this.state.axes
                    ).toString() + "px"
                  }
                  top={
                    yCoord2Pixel(
                      this.props.points[idx].coords[1],
                      this.state.canvasRef.current.getContext("2d"),
                      this.state.axes
                    ).toString() + "px"
                  }
                >
                  <p className="coord"></p>
                </div>
              );
            })
          : null}
      </div>
    );
  }
}

export default Plot;
