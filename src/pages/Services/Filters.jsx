import React from "react";
import debounce from "lodash/debounce";

import GridItem from "../../components/Grid/GridItem";

import GridContainer from "../../components/Grid/GridContainer";
import CustomInput from "../../components/CustomInput/CustomInput";
import { Select } from "../../components/CustomInput/Select";

const options = [
  { label: "Integral", value: "full" },
  { label: "Parcial", value: "partial" },
];

export function Filters({ handleSetFilters }) {
  const handleChangeName = (event) => {
    handleSetFilters("name", event.target.value);
  };

  const handleChangePrice = (event) => {
    handleSetFilters("price", event.target.value);
  };

  const loadChangeName = debounce(handleChangeName, 500);
  const loadChangePrice = debounce(handleChangePrice, 500);

  return (
    <GridContainer>
      <GridItem xs={12} sm={3} md={3}>
        <CustomInput
          id="name"
          labelText="Nome"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            required: true,
            onChange: loadChangeName,
          }}
        />
      </GridItem>

      <GridItem xs={12} sm={3} md={3}>
        <CustomInput
          id="price"
          labelText="Preço"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            required: true,
            type: "number",
            onChange: loadChangePrice,
          }}
        />
      </GridItem>

      <GridItem xs={12} sm={3} md={3}>
        <Select
          options={options}
          onChange={(value) => handleSetFilters("type", value)}
        />
      </GridItem>
    </GridContainer>
  );
}
