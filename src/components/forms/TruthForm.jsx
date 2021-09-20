import React, { Component } from "react";

import NumericInput from "./NumericInput";
import Slider from "./Slider";
import { truth } from "../../algorithms/TruthFunctions";

class TruthForm extends Component {
  state = {
    numPoints: "10",
    types: ["Linear", "Sinusoidal", "Step"],
    noise: 0,
    selected: "Linear",
    truthMin: "-5",
    truthMax: "5",
  };

  constructor() {
    super();

    this.changeNumPoints = this.changeNumPoints.bind(this);
  }

  clickFunction = (e) => {
    this.setState({
      selected: e.target.value,
    });
  };

  changeNumPoints = (e) => {
    const numPoints = e.target.value;

    this.setState({
      numPoints: numPoints.toString(),
    });
  };

  changeNoise = (e) => {
    this.setState({
      noise: e.target.value,
    });
  };

  changeMin = (e) => {
    const newMin = parseFloat(e.target.value);

    if (isNaN(newMin)) {
      this.setState({
        truthMin: e.target.value,
      });
    } else {
      newMin < parseFloat(this.state.truthMax)
        ? this.setState({ truthMin: newMin.toString() })
        : this.setState({
            truthMin: (parseFloat(this.state.truthMax) - 0.01).toString(),
          });
    }
  };

  changeMax = (e) => {
    const newMax = parseFloat(e.target.value);

    if (isNaN(newMax)) {
      this.setState({
        truthMax: e.target.value,
      });
    } else {
      newMax > parseFloat(this.state.truthMin)
        ? this.setState({ truthMax: newMax.toString() })
        : this.setState({
            truthMax: (parseFloat(this.state.truthMin) + 0.01).toString(),
          });
    }
  };

  generatePoints = () => {
    const max = parseFloat(this.state.truthMax);
    const min = parseFloat(this.state.truthMin);
    const numPoints = parseFloat(this.state.numPoints);

    Array.from(Array(numPoints).keys()).forEach(() => {
      const xCoord = Math.random() * (max - min) + min;
      const yCoord = truth(xCoord, this.state.selected, this.state.noise);

      this.props.addPoint(xCoord, yCoord);
    });
  };

  render() {
    return (
      <form className={this.props.className}>
        <h4 className="truth-header">ADD DATAPOINTS</h4>
        <div className="sep-line" />
        <ul className="truth-functions">
          {this.state.types.map((truthType, idx) => {
            return (
              <li key={truthType}>
                <input
                  className={
                    truthType === this.state.selected
                      ? "truth-function-selected"
                      : "truth-function"
                  }
                  type="button"
                  value={truthType}
                  onClick={this.clickFunction}
                />
              </li>
            );
          })}
        </ul>
        <label className="truth-label" htmlFor="truth-points-input">
          <div className="truth-p">
            <p>Points:</p>
          </div>
          <div className="truth-slider">
            <Slider
              id="truth-points-input"
              value={this.state.numPoints}
              min={1}
              max={50}
              step={1}
              onChange={this.changeNumPoints}
            />
            <p className="noise-display">{this.state.numPoints}</p>
          </div>
        </label>
        <label className="truth-label" htmlFor="truth-noise-input">
          <div className="truth-p">
            <p>Noise:</p>
          </div>
          <div className="truth-slider">
            <Slider
              id="truth-noise-input"
              min={0}
              max={2}
              step={0.01}
              value={this.state.noise}
              onChange={this.changeNoise}
            />
            <p className="noise-display">{this.state.noise}</p>
          </div>
        </label>
        <label className="truth-label" htmlFor="truth-min-input">
          <p>Lower x-bound:</p>
          <NumericInput
            id={"truth-min-input"}
            value={this.state.truthMin}
            onChange={this.changeMin}
          />
        </label>
        <label className="truth-label" htmlFor="truth-max-input">
          <p>Higher x-bound:</p>
          <NumericInput
            id={"truth-max-input"}
            value={this.state.truthMax}
            onChange={this.changeMax}
          />
        </label>
        <input
          className="btn generate-button"
          type="button"
          value={"Generate"}
          onClick={this.generatePoints}
        />
      </form>
    );
  }
}

export default TruthForm;
