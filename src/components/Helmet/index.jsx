import React from "react";

import { Helmet as ReactHelmet } from "react-helmet";

export function Helmet({ title }) {
  return (
    <ReactHelmet>
      <meta charSet="utf-8" />
      <title>Petrecho - {title}</title>
    </ReactHelmet>
  );
}
