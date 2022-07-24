import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter} from 'react-router-dom';
import "./app.css";
import Snowfall from 'react-snowfall'


ReactDOM.render(
  <BrowserRouter>
    <App />
    <Snowfall 
    snowflakeCount={200}
    style={{
      position: 'fixed',
      width: '100vw',
      height: '100vh'
    }}
    />
  </BrowserRouter>,
  document.getElementById("root")
);
