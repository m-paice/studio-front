import React from "react";

import "./styles.css";

export function Loading({ message = "Processando sua requisição!" }) {
  return (
    <div className="container">
      <span className="loader"></span>
      <p className="text"> {message} </p>
    </div>
  );
}
