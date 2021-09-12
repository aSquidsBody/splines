import { Component } from "react";

class Slider extends Component {
  // Props (given from up on high): min, max, step-size, id, value, onChange

  onChange = (e) => {
    this.props.onChange(e);
  };

  render() {
    return (
      <div className="slider-component">
        {this.props.id ? (
          <input
            id={this.props.id}
            type="range"
            className="slider"
            value={this.props.value}
            onChange={this.onChange}
            step={this.props.step}
            min={this.props.min}
            max={this.props.max}
          />
        ) : (
          <input
            type="range"
            className="slider"
            value={this.props.value}
            onChange={this.onChange}
            step={this.props.step}
            min={this.props.min}
            max={this.props.max}
          />
        )}
        <p className="slider-min">{this.props.min}</p>
        <p className="slider-max">{this.props.max}</p>
      </div>
    );
  }
}

export default Slider;
