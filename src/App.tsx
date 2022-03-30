import React from "react";
import logo from "./logo.svg";
import "./App.css";
import CommandBar from "./component/CommandBar";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div>
          <a className="App-link">
            1. Make sure you already login into
            https://vm.app.axcelerate.com/management/index.cfm
          </a>
          <a className="App-link">2. Press Command+K to search</a>
          <a className="App-link">
            3. e.g. search "add new workshop", press enter, it will take you to
            the corresponding page
          </a>
          <a className="App-link">
            4.search your name, it will take 1.5s to get data back (mimic
            fetching API)
          </a>
        </div>
      </header>
      <CommandBar />
    </div>
  );
}

export default App;
