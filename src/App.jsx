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
        <div className="content container">
          <section className="options-bar">
            <div className="description">
              <p>
                {"Visualize "}
                <span className="italics">Polynomial Regression</span> and{" "}
                <span className="italics">Splines</span>
              </p>
              <p>_</p>
              <p>Learn more about Polynomial Regression</p>
              <p>Learn more about Splines</p>
            </div>
            {/* <PointForm
              pointInput={this.state.pointInput}
              inputXchange={this.inputXchange}
              inputYchange={this.inputYchange}
              addPoint={this.addPoint}
            /> */}
            <TraceForm
              traces={this.state.traces}
              traceChange={this.traceChange}
            />
            <TruthForm addPoint={this.addPoint} />
            <form className="clear-form">
              <input
                className="btn clear-button"
                type="button"
                value={"Clear Graph"}
                onClick={this.clearPoints}
              />
            </form>
          </section>
          <Plot points={this.state.points} plot={this.state.plot} />
        </div>
      </div>
    );
  }
}

export default App;
