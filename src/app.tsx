import React from "react";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import routes, { subs } from "./routes";
import Admin from "./layouts/Admin";
import { LayoutLogin } from "./layouts/Login";

import "./assets/css/material-dashboard-react.css";
import { AuthContextProvider } from "./context/Auth";

export function App() {
  return (
    <BrowserRouter>
      <Switch>
        <AuthContextProvider>
          {/* <Redirect from="/" to="/login" /> */}
          <Route exact path="/" component={LayoutLogin} />
          {routes.map((prop, key) => {
            const Component = prop.component;

            return (
              <Route
                exact
                path={prop.path}
                render={(routeProps) => (
                  <Admin>
                    {" "}
                    <Component {...routeProps} />{" "}
                  </Admin>
                )}
                key={key}
              />
            );
          })}
          {subs.map((prop, key) => {
            const Component = prop.component;

            return (
              <Route
                exact
                path={prop.path}
                render={(routeProps) => (
                  <Admin>
                    {" "}
                    <Component {...routeProps} />{" "}
                  </Admin>
                )}
                key={key}
              />
            );
          })}
        </AuthContextProvider>
      </Switch>
    </BrowserRouter>
  );
}
