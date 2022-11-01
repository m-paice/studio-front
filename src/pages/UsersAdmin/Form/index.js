import React, { useEffect, useState } from "react";

import { NavLink, useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import GridItem from "../../../components/Grid/GridItem.js";
import GridContainer from "../../../components/Grid/GridContainer.js";
import CustomInput from "../../../components/CustomInput/CustomInput.js";
import Button from "../../../components/CustomButtons/Button.js";
import Card from "../../../components/Card/Card.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import CardBody from "../../../components/Card/CardBody.js";
import CardFooter from "../../../components/Card/CardFooter.js";
import { useAsync } from "../../../hooks/useAsync.js";
import { useForm } from "../../../hooks/useForm";
import { userResource } from "../../../services/users/index.js";
import { accountResource } from "../../../services/accounts";
import { SelectAsync } from "../../../components/CustomInput/SelectAsync";
import { Skeleton } from "../../../components/Skeleton/index.js";

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

const errorsMessage = {
  required: "Campo obrigatório",
};

const initialValues = {
  name: "",
  cellPhone: "",
  password: "",
  account: "",
};

const useStyles = makeStyles(styles);

export function UsersAdminForm() {
  const classes = useStyles();

  const history = useHistory();
  const { id } = useParams();

  const { execute: create, status: statusCreated } = useAsync(
    userResource.create
  );
  const { execute: updateById, status: statusUpdated } = useAsync(
    userResource.updateById
  );
  const { execute: findById, value: user } = useAsync(userResource.findById);

  const [fields, setField, setAllFields, validateAllFields] = useForm({
    initialValues,
    requireds: ["name", "cellPhone", "account"],
  });

  const [errors, setErrors] = useState();

  useEffect(() => {
    if (id) findById(id);
  }, []);

  useEffect(() => {
    if (statusCreated === "success" || statusUpdated === "success") {
      history.push("/useradmin");
    }
  }, [statusCreated, statusUpdated]);

  useEffect(() => {
    if (user) {
      setAllFields({
        name: user.name,
        cellPhone: user.cellPhone,
        password: user.password,
        account: user.account
          ? { label: user.account.name, value: user.account }
          : { label: "Nenhuma conta encontrada", value: "" },
      });
    }
  }, [user]);

  const handleSubmit = () => {
    const validate = validateAllFields();

    if (!validate.isValid) {
      setErrors(validate.errors);
      return;
    }

    const payload = {
      cellPhone: fields.cellPhone,
      name: fields.name,
      password: fields.password,
      accountId: fields.account.value.id,
    };

    if (id) {
      return updateById(id, payload);
    }

    create(payload);
  };

  const isEditing = !!id;

  if (isEditing && !fields.account) {
    return (
      <div>
        <h4>
          <Skeleton />
        </h4>
        <Card>
          <CardHeader color="info">
            <Skeleton lines={2} />
          </CardHeader>
          <CardBody>
            <Skeleton lines={2} />
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4> {isEditing ? "Atualizar" : "Novo"} Usuário </h4>
        <NavLink to="/useradmin">
          <Button color="info">Voltar</Button>
        </NavLink>
      </div>
      <Card>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>
            {isEditing ? "Atualizando" : "Criando"} usuário
          </h4>
          <p className={classes.cardCategoryWhite}>
            Preencha os dados do usuário
          </p>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <CustomInput
                id="name"
                labelText="Nome"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  required: true,
                  value: fields.name,
                  onChange: (event) => setField("name", event.target.value),
                }}
              />
              <span style={{ fontSize: 12, color: "red" }}>
                {" "}
                {!!errors?.name && errorsMessage[errors.name]}{" "}
              </span>
            </GridItem>

            <GridItem xs={12} sm={6} md={6}>
              <SelectAsync
                exec={accountResource.findByName}
                clickOption={(value) => setField("account", value)}
                placeholder="Pesquise uma conta"
                defaultValue={fields.account}
              />
              <span style={{ fontSize: 12, color: "red" }}>
                {" "}
                {!!errors?.account && errorsMessage[errors.account]}{" "}
              </span>
            </GridItem>

            <GridItem xs={12} sm={6} md={6}>
              <CustomInput
                id="cellPhone"
                labelText="Telefone"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  value: fields.cellPhone,
                  onChange: (event) =>
                    setField("cellPhone", event.target.value),
                }}
              />
              <span style={{ fontSize: 12, color: "red" }}>
                {" "}
                {!!errors?.cellPhone && errorsMessage[errors.cellPhone]}{" "}
              </span>
            </GridItem>

            <GridItem xs={12} sm={6} md={6}>
              <CustomInput
                id="password"
                labelText="Senha"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  value: fields.password,
                  onChange: (event) => setField("password", event.target.value),
                }}
              />
            </GridItem>
          </GridContainer>
        </CardBody>
        <CardFooter>
          <Button color="info" onClick={handleSubmit}>
            {isEditing ? "Atualizar" : "Cadastrar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
