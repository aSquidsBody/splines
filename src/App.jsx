import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";

import Navbar from "./components/Navbar";
import Plot from "./components/Plot";
import TraceForm from "./components/forms/TraceForm";
import PointForm from "./components/forms/PointForm";
import TruthForm from "./components/forms/TruthForm";

import "./styles/App.css";

class App extends Component {
  state = {
    points: [],
    plot: {
      type: "PolynomialRegression+1",
    },
    pointInput: {
      x: 0,
      y: 0,
    },
    traces: {
      Regression: [
        { verboseName: "Linear", name: "PolynomialRegression+1" },
        { verboseName: "Quadratic", name: "PolynomialRegression+2" },
        { verboseName: "Cubic", name: "PolynomialRegression+3" },
        { verboseName: "4th degree", name: "PolynomialRegression+4" },
        { verboseName: "5th degree", name: "PolynomialRegression+5" },
        { verboseName: "6th degree", name: "PolynomialRegression+6" },
        { verboseName: "7th degree", name: "PolynomialRegression+7" },
        { verboseName: "8th degree", name: "PolynomialRegression+8" },
        { verboseName: "9th degree", name: "PolynomialRegression+9" },
        { verboseName: "10th degree", name: "PolynomialRegression+10" },
      ],
      Spline: [
        { verboseName: "Cubic", name: "CubicSpline" },
        { verboseName: "Linear", name: "LinearSpline" },
      ],
    },
  };

  constructor() {
    super();
    this.removePoint = this.removePoint.bind(this);
    this.traceChange = this.traceChange.bind(this);
    this.inputXchange = this.inputXchange.bind(this);
    this.inputYchange = this.inputYchange.bind(this);
    this.addPoint = this.addPoint.bind(this);
    this.clearPoints = this.clearPoints.bind(this);
  }

  addPoint = (x, y) => {
    const points = this.state.points;

    const newId = uuidv4().toString().replace("-", "1");
    const ref = React.createRef();

    points.push({
      ref,
      id: newId,
      pos: [0, 0, 0, 0],
      coords: [x, y],
      diameter: 15,
    });

    this.setState({
      points,
    });
  };

  removePoint = (pointId) => {
    const state = this.state;
    const index = state.points.map((point) => point.id).indexOf(pointId);
    if (index > -1) {
      state.points.splice(index, 1);
    }
    this.setState(state);
  };

  clearPoints = () => {
    this.setState({
      points: [],
    });
  };

  resetPoints = () => {
    this.setState({
      points: [],
    });
  };

  traceChange = (traceName) => {
    const plot = this.state.plot;
    plot.type = traceName;

    this.setState({
      plot,
    });
  };

  isNum = (val) => {
    return val.match(/^[+-]?([0-9]*\.?[0-9]*)$/) !== null ? true : false;
  };

  inputXchange = (e) => {
    e = e || window.event;
    e.preventDefault();

    if (this.isNum(e.target.value)) {
      const pointInput = this.state.pointInput;
      pointInput.x = e.target.value;
      this.setState({
        pointInput,
      });
    }
  };

  inputYchange = (e) => {
    e = e || window.event;
    e.preventDefault();

    if (this.isNum(e.target.value)) {
      const pointInput = this.state.pointInput;
      pointInput.y = e.target.value;
      this.setState({
        pointInput,
      });
    }
  };

  render() {
    return (
      <div className="app">
        <Navbar />
        <div className="content">
          <Plot points={this.state.points} plot={this.state.plot} />
          <div className="invisible-options-container">
            <section className="options-bar">
              <TruthForm addPoint={this.addPoint} className={"truth-form"} />
              <TraceForm
                traces={this.state.traces}
                traceChange={this.traceChange}
                className={"trace-form"}
              />
              <div className="description">
                <p>
                  {"Visualize "}
                  <span className="italics">
                    Polynomial Regression
                  </span> and <span className="italics">Splines</span>
                </p>
                <p>_</p>
                <p>
                  Generate datapoints and then choose a regression/spline
                  function to fit the data!
                </p>
                <p>Drag the points on screen and watch the plot react!</p>
                <p>_</p>
                <p>
                  Learn more about{" "}
                  <a
                    className="light-link"
                    href="https://en.wikipedia.org/wiki/Polynomial_regression"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Polynomial Regression
                  </a>
                </p>
                <p>
                  Learn more about{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Spline_(mathematics)"
                    className="light-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Splines
                  </a>
                </p>
              </div>
            </section>
          </div>
          <form className="clear-form">
            <input
              className="btn clear-button"
              type="button"
              value={"Clear Graph"}
              onClick={this.clearPoints}
            />
          </form>
        </div>
      </div>
    );
  }
}

export default App;
