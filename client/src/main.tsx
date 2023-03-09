import ReactDOM from "react-dom";
import "./index.css";
import Wrapper from "./components/Wrapper";
import React from "react";
import { store } from "./app/store";
import { Provider } from "react-redux";
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Wrapper />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
