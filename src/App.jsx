import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";

import Plot from "./components/Plot";

import "./styles/App.css";

class App extends Component {
  state = {
    points: [],
    pointObjects: [],
    regressionDegree: 1,
    maxDegree: 10,
  };

  addPoint = () => {
    const points = this.state.points;
    const pointObjects = this.state.pointObjects;

    const newId = uuidv4().toString().replace("-", "1");
    points.push(newId);

    const ref = React.createRef();

    pointObjects.push({
      ref,
      id: newId,
      pos: [0, 0, 0, 0],
      coords: [20 * (Math.random() - 0.5), 10 * (Math.random() - 0.5)],
    });

    this.setState({
      points,
      pointObjects,
    });
  };

  removePoint = (pointId) => {
    const state = this.state;
    delete state[pointId];

    this.setState(state);
  };

  resetPoints = () => {
    this.setState({
      points: [],
    });
  };

  onDegreeChange = (e) => {
    this.setState({
      regressionDegree: parseInt(e.target.value),
    });
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
            <input
              class="btn"
              type="button"
              onClick={this.addPoint}
              value="Add Points"
            />

            <form className="degree-form" onSubmit={this.formSubmit}>
              <div>
                {Array.from(new Array(this.state.maxDegree), (x, idx) => {
                  return (
                    <div className="radio" key={idx.toString() + "poly"}>
                      <label>
                        <input
                          type="radio"
                          value={idx + 1}
                          checked={this.state.regressionDegree === idx + 1}
                          onChange={this.onDegreeChange}
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
              </div>

              <button type="submit">Submit</button>
            </form>
          </section>
          <Plot
            points={this.state.points}
            pointObjects={this.state.pointObjects}
            regressionDegree={this.state.regressionDegree}
          />
        </section>
      </div>
    );
  }
}

export default App;
