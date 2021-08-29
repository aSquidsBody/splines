import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";

import Plot from "./components/Plot";

import "./styles/App.css";

class App extends Component {
  state = {
    points: [],
    maxDegree: 10,
    plot: {
      type: "PolynomialRegression+1",
    },
    pointInput: {
      x: 0,
      y: 0,
    },
    message: "",
  };

  constructor() {
    super();
    this.removePoint = this.removePoint.bind(this);
  }

  addPoint = () => {
    const points = this.state.points;

    const newId = uuidv4().toString().replace("-", "1");
    const ref = React.createRef();

    points.push({
      ref,
      id: newId,
      pos: [0, 0, 0, 0],
      coords: [20 * (Math.random() - 0.5), 10 * (Math.random() - 0.5)],
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

  resetPoints = () => {
    this.setState({
      points: [],
    });
  };

  functionChange = (e) => {
    const plot = this.state.plot;
    plot.type = e.target.value;

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
        <nav className="navbar">
          <div className="container">
            <h3 className="title">Regression Explorer</h3>
          </div>
        </nav>
        <section className="plot-section container">
          <section className="options-bar container">
            <form className="degree-form">
              {Array.from(new Array(this.state.maxDegree), (x, idx) => {
                return (
                  <div className="radio-select" key={idx.toString() + "poly"}>
                    <label>
                      <input
                        className="radio"
                        type="radio"
                        value={"PolynomialRegression+" + (idx + 1).toString()}
                        checked={
                          this.state.plot.type ===
                          "PolynomialRegression+" + (idx + 1).toString()
                        }
                        onChange={this.functionChange}
                      />
                      {idx + 1 === 1
                        ? "Linear"
                        : idx + 1 === 2
                        ? "Quadratic"
                        : idx + 1 === 3
                        ? "Cubic"
                        : (idx + 1).toString() + "th degree"}
                    </label>
                  </div>
                );
              })}
              <div className="radio-select" key={"Spline"}>
                <label>
                  <input
                    className="radio"
                    type="radio"
                    value={"Spline"}
                    checked={this.state.plot.type === "Spline"}
                    onChange={this.functionChange}
                  />
                  {"Spline"}
                </label>
              </div>
            </form>

            <form className="point-form">
              <p>Enter x, y point...</p>
              <input
                id="x-input"
                name="x-input"
                type="text"
                value={this.state.pointInput.x}
                onChange={this.inputXchange}
                className="coord-input"
              />
              <input
                id="y-input"
                name="y-input"
                type="text"
                value={this.state.pointInput.y}
                onChange={this.inputYchange}
                className="coord-input"
              />
              <input
                className="btn"
                type="button"
                onClick={this.addPoint}
                value="Add to graph"
              ></input>
            </form>
          </section>
          <Plot
            points={this.state.points}
            removePoint={this.removePoint}
            plot={this.state.plot}
          />
        </section>
      </div>
    );
  }
}

export default App;
