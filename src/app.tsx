import { BrowserRouter, Route, Switch } from "react-router-dom";

import routes, { subs } from "./routes";
import Admin from "./layouts/Admin";
import { LayoutLogin } from "./layouts/Login";
import { PoliticaPrivacidade } from "./pages/PoliticaPrivacidade";
import { Confirmed } from "./pages/Confirmed";

import "./assets/css/material-dashboard-react.css";
import { AuthContextProvider } from "./context/Auth";

export function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/politica-privacidade"
          component={PoliticaPrivacidade}
        />
        <Route exact path="/confirmacao" component={Confirmed} />
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
