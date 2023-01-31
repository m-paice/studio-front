import React from "react";

import * as S from "./styles";

export function Skeleton({ lines = 1, size = "md" }) {
  return (
    <S.Container>
      {Array.from({ length: lines }).map((_, index) => (
        <S.Loader key={index} size={size}>
          {}
        </S.Loader>
      ))}
    </S.Container>
  );
}
