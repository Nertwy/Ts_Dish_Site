import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Link, Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import DishPage from "./components/DishPage";
import Wrapper from "./components/Wrapper";
ReactDOM.render(
  <Wrapper/>,
  document.getElementById("root")
);
