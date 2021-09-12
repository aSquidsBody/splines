import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

class Dropdown extends Component {
  // Props include
  //   options: string[]
  //   optionCallback: (string) => void
  //   title: string
  state = {
    collapsed: true,
    aRef: React.createRef(), // reference the 'select' element
  };

  // When an option is clicked
  onClickOption = (option) => () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
    this.props.optionCallback(option);
  };

  onClickSelect = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });

    const button = this.state.aRef.current;

    if (button.styles) {
      button.styles.opacity = 0.75;
      button.styles.background = "linear-gradient(darkred, rgb(0, 0, 90))";
      button.styles.transform = "translateY(2px) translateX(1px)";
    }
  };

  onBlur = () => {
    this.setState({
      collapsed: true,
    });
  };

  render() {
    const title = this.props.title || "TITLE";
    const options = this.props.options || [];
    return (
      <div className="dropdown-select">
        <a
          className="btn dropdown-title"
          onClick={this.onClickSelect}
          onBlur={this.onBlur}
          href="#"
          ref={this.state.aRef}
        >
          <p>{title + " "}</p>
          <FontAwesomeIcon className="dropdown-icon" icon={faCaretDown} />
        </a>
        {this.state.collapsed ? null : (
          <div className="dropdown-list">
            {options.map((option, idx) => {
              return (
                <div
                  className="dropdown-option"
                  key={option}
                  onMouseDown={this.onClickOption(option)}
                >
                  {option}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default Dropdown;
