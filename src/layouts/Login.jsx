import React from "react";
import { Switch, Route } from "react-router-dom";
import { routeLogin } from "../routes";

import bg from "../assets/img/cover.jpeg";

const switchRoute = (
  <Switch>
    <Route exact path={routeLogin.path} component={routeLogin.component} />
  </Switch>
);

export function LayoutLogin() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {switchRoute}
    </div>
  );
}
