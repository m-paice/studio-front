import React from "react";

import GridItem from "../../components/Grid/GridItem";

import GridContainer from "../../components/Grid/GridContainer";
import { SelectAsync } from "../../components/CustomInput/SelectAsync";
import { Select } from "../../components/CustomInput/Select";
import { userResource } from "../../services/users";
import { serviceResource } from "../../services/services";

const options = [
  { label: "Finalizado", value: "finished" },
  { label: "Cancelado", value: "canceled" },
  { label: "Pendente", value: "pending" },
];

export function Filters({ handleSetFilters }) {
  return (
    <GridContainer>
      <GridItem xs={12} sm={3} md={3}>
        <SelectAsync
          exec={userResource.findByName}
          clickOption={(value) => handleSetFilters("user", value)}
          placeholder="Pesquise um usuário"
        />
      </GridItem>

      <GridItem xs={12} sm={3} md={3}>
        <SelectAsync
          exec={userResource.findEmployeeByName}
          clickOption={(value) => handleSetFilters("employee", value)}
          placeholder="Pesquise um funcionário"
        />
      </GridItem>

      <GridItem xs={12} sm={3} md={3}>
        <SelectAsync
          exec={serviceResource.findByName}
          clickOption={(value) => handleSetFilters("service", value)}
          placeholder="Pesquise um serviço"
        />
      </GridItem>

      <GridItem xs={12} sm={3} md={3}>
        <Select
          options={options}
          onChange={(value) => handleSetFilters("status", value)}
        />
      </GridItem>
    </GridContainer>
  );
}
