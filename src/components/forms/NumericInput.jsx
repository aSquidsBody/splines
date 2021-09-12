import { Component } from "react";

class NumericInput extends Component {
  // Method to check whether input is number
  isFloat = (val) => {
    const allowNegative =
      this.props.allowNegative === undefined ? true : this.props.allowNegative;

    if (allowNegative)
      return val.match(/^[+-]?([0-9]*\.?[0-9]*)$/) !== null ? true : false;
    else return val.match(/^[+]?([0-9]*\.?[0-9]*)$/) !== null ? true : false;
  };

  isInt = (val) => {
    const allowNegative =
      this.props.allowNegative === undefined ? true : this.props.allowNegative;
    if (allowNegative)
      return val.match(/^[+-]?([0-9]*)$/) !== null ? true : false;
    else return val.match(/^[+]?([0-9]*)$/) !== null ? true : false;
  };

  // Method to apply change
  inputChange = (e) => {
    e = e || window.event;
    e.preventDefault();

    const allowFloat = this.props.allowFloat || true;

    if (allowFloat && this.isFloat(e.target.value)) {
      this.props.onChange(e);
    } else if (!allowFloat && this.isInt(e.target.value)) {
      this.props.onChange(e);
    }
  };

  render() {
    if (this.props.id) {
      return (
        <input
          type="text"
          value={this.props.value}
          onChange={this.inputChange}
          className="numeric-input"
        />
      );
    } else {
      return (
        <input
          id={this.props.id}
          type="text"
          value={this.props.value}
          onChange={this.inputChange}
          className="numeric-input"
        />
      );
    }
  }
}

export default NumericInput;
