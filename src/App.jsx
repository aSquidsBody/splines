import { Component } from "react";

import Plot from "./components/Plot";

import "./styles/App.css";

class App extends Component {
  render() {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="container">
            <h3 className="title">Regression Explorer</h3>
          </div>
        </nav>
        <section className="plot-section container">
          <Plot />
        </section>
      </div>
    );
  }
}

export default App;
