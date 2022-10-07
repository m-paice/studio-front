import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

// core components
import Admin from "./layouts/Admin.js";

import "./assets/css/material-dashboard-react.css";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" component={Admin} />
      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
