import { Component } from "react";
import Dropdown from "../Dropdown";

class TraceForm extends Component {
  state = {
    selectedType: "",
    selectedTrace: "",
  };

  setup = (props) => {
    const selectedType = Object.keys(props.traces)[0];
    const selectedTrace = props.traces[selectedType][0].name;

    this.setState({
      selectedType,
      selectedTrace,
    });
  };

  componentDidMount() {
    this.setup(this.props);
  }

  // method to set the type
  setType = (type) => {
    this.setState({
      selectedType: type,
    });
  };

  // Method to set the trace
  setTrace = (selectedTrace) => () => {
    this.setState({
      selectedTrace,
    });

    this.props.traceChange(selectedTrace);
  };

  render() {
    const types = Object.keys(this.props.traces);
    return (
      <div className="trace-form">
        <h4 className="truth-header">Choose fit</h4>

        <div className="trace-selection">
          <Dropdown
            title={this.state.selectedType + " "}
            options={types}
            optionCallback={this.setType}
          />
        </div>
        <form className="degree-form">
          {this.state.selectedType
            ? this.props.traces[this.state.selectedType].map(
                ({ name, verboseName }, idx) => {
                  return (
                    <div
                      className="radio-select"
                      key={"function_" + idx.toString()}
                    >
                      <input
                        id={"radio" + idx.toString()}
                        className="radio"
                        type="radio"
                        value={name}
                        checked={this.state.selectedTrace === name}
                        onChange={this.setTrace(name)}
                      />
                      <label
                        htmlFor={"radio" + idx.toString()}
                        className="radio-label"
                      >
                        {verboseName}
                      </label>
                    </div>
                  );
                }
              )
            : null}
        </form>
      </div>
    );
  }
}

export default TraceForm;
