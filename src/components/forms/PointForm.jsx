import { Component } from "react";

class PointForm extends Component {
  render() {
    return (
      <form className="point-form">
        <p>Enter x, y point...</p>
        <input
          id="x-input"
          name="x-input"
          type="text"
          value={this.props.pointInput.x}
          onChange={this.props.inputXchange}
          className="coord-input"
        />
        <input
          id="y-input"
          name="y-input"
          type="text"
          value={this.props.pointInput.y}
          onChange={this.props.inputYchange}
          className="coord-input"
        />
        <input
          className="btn"
          type="button"
          onClick={this.props.addPoint}
          value="Add to graph"
        />
      </form>
    );
  }
}

export default PointForm;
