import React from "react";
import debounce from "lodash/debounce";

import GridItem from "../../components/Grid/GridItem";

import GridContainer from "../../components/Grid/GridContainer";
import CustomInput from "../../components/CustomInput/CustomInput";
import { SelectAsync } from "../../components/CustomInput/SelectAsync";
import { accountResource } from "../../services/accounts";
import { Select } from "../../components/CustomInput/Select";
import { userResource } from "../../services/users";

const options = [
  { label: "POST", value: "POST" },
  { label: "GET", value: "GET" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
  { label: "PATCH", value: "PATCH" },
];

export function Filters({ handleSetFilters }) {
  const handleChangeMethod = (event) => {
    handleSetFilters("method", event.target.value);
  };

  const loadChangeMethod = debounce(handleChangeMethod, 500);

  const handleChangeOriginalURL = (event) => {
    handleSetFilters("originalUrl", event.target.value);
  };

  const loadChangeOriginalURL = debounce(handleChangeOriginalURL, 500);

  return (
    <GridContainer>
      <GridItem xs={12} sm={3} md={3}>
        <SelectAsync
          exec={accountResource.findByName}
          clickOption={(value) => handleSetFilters("account", value)}
          placeholder="Pesquise uma conta"
        />
      </GridItem>

      <GridItem xs={12} sm={3} md={3}>
        <SelectAsync
          exec={userResource.findByName}
          clickOption={(value) => handleSetFilters("user", value)}
          placeholder="Pesquise um usuário"
        />
      </GridItem>

      <GridItem xs={12} sm={3} md={3}>
        <Select
          options={options}
          onChange={(value) => handleSetFilters("method", value)}
          placeholder="Selecione um método"
        />
      </GridItem>

      <GridItem xs={12} sm={3} md={3}>
        <CustomInput
          id="originalUrl"
          labelText="URL"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            required: true,
            onChange: loadChangeOriginalURL,
          }}
        />
      </GridItem>
    </GridContainer>
  );
}
