import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core";
import { NavLink, useHistory } from "react-router-dom";

import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardBody from "../../../components/Card/CardBody";
import Button from "../../../components/CustomButtons/Button";
import GridItem from "../../../components/Grid/GridItem";
import GridContainer from "../../../components/Grid/GridContainer";
import CustomInput from "../../../components/CustomInput/CustomInput";
import CardFooter from "../../../components/Card/CardFooter";
import { Loading } from "../../../components/Loading";
import { reportsResource } from "../../../services/reports";
import { useForm } from "../../../hooks/useForm";
import { useAsync } from "../../../hooks/useAsync";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const initialValues = {
  description: "",
  value: "",
};
const errorsMessage = {
  required: "Campo obrigatório",
};

const useStyles = makeStyles(styles);

export function ReportForm() {
  const classes = useStyles();

  const history = useHistory();

  const [fields, setField, setAllFields, validateAllFields] = useForm({
    initialValues,
    requireds: ["description", "value"],
  });

  const { execute, status: statusCreated } = useAsync(
    reportsResource.registerOut
  );

  const [errors, setErrors] = useState();

  useEffect(() => {
    if (statusCreated === "success") {
      history.push("/reports");
    }
  }, [statusCreated]);

  const handleSubmit = () => {
    const validate = validateAllFields();

    if (!validate.isValid) {
      setErrors(validate.errors);
      return;
    }

    execute(fields);
  };

  return (
    <div>
      {statusCreated === "pending" && <Loading />}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4> Novo registro de saída </h4>
        <NavLink to="/reports">
          <Button color="info">Voltar</Button>
        </NavLink>
      </div>
      <Card>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>Criando registro de saída</h4>
          <p className={classes.cardCategoryWhite}>
            Preencha os dados do registo de saída
          </p>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <CustomInput
                id="description"
                labelText="Descrição"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  required: true,
                  value: fields.description,
                  onChange: (event) =>
                    setField("description", event.target.value),
                }}
              />
              <span style={{ fontSize: 12, color: "red" }}>
                {!!errors?.description && errorsMessage[errors.description]}
              </span>
            </GridItem>

            <GridItem xs={12} sm={6} md={6}>
              <CustomInput
                id="value"
                labelText="Valor"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "number",
                  required: true,
                  value: fields.value,
                  onChange: (event) => setField("value", event.target.value),
                }}
              />
              <span style={{ fontSize: 12, color: "red" }}>
                {!!errors?.value && errorsMessage[errors.value]}
              </span>
            </GridItem>
          </GridContainer>
        </CardBody>
        <CardFooter>
          <Button color="info" onClick={handleSubmit}>
            Cadastrar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
