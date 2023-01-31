import React from "react";
import debounce from "lodash/debounce";

import GridItem from "../../components/Grid/GridItem";

import GridContainer from "../../components/Grid/GridContainer";
import CustomInput from "../../components/CustomInput/CustomInput";

export function Filters({ handleSetFilters }) {
  const handleChangeName = (event) => {
    handleSetFilters("name", event.target.value);
  };

  const handleChangePhone = (event) => {
    handleSetFilters("phone", event.target.value);
  };

  const loadChangeName = debounce(handleChangeName, 500);
  const loadChangePhone = debounce(handleChangePhone, 500);

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
          id="phone"
          labelText="Telefone"
          formControlProps={{
            fullWidth: true,
          }}
          inputProps={{
            required: true,
            onChange: loadChangePhone,
          }}
        />
      </GridItem>
    </GridContainer>
  );
}
