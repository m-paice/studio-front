import React from "react";

import * as S from "./styles";

import Button from "../CustomButtons/Button";

export function Pagination({
  currentPage,
  lastPage,
  total,
  nextPage,
  previousPage,
  goToPage,
}) {
  return (
    <S.PaginationContainer>
      <div>
        <Button
          color="info"
          onClick={() => goToPage(1)}
          // disabled={!canPreviousPage}
        >
          Primeira
        </Button>
        <Button
          color="info"
          onClick={() => previousPage()}
          // disabled={!canPreviousPage}
        >
          Anterior
        </Button>
        <span>
          Página {currentPage || 0} de {lastPage || 0}
        </span>
        <Button
          color="info"
          onClick={() => nextPage()}
          // disabled={!canNextPage}
        >
          Próxima
        </Button>
        <Button
          color="info"
          onClick={() => goToPage(lastPage)}
          // disabled={!canNextPage}
        >
          Última
        </Button>

        <span>Total: {total || 0}</span>
      </div>
    </S.PaginationContainer>
  );
}
