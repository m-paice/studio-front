import React, { useEffect, useState } from "react";

import format from "date-fns/format";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import GridItem from "../../../components/Grid/GridItem";
import GridContainer from "../../../components/Grid/GridContainer";
import CustomInput from "../../../components/CustomInput/CustomInput";
import Button from "../../../components/CustomButtons/Button";
import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardBody from "../../../components/Card/CardBody";
import CardFooter from "../../../components/Card/CardFooter";
import { useAsync } from "../../../hooks/useAsync";
import { useForm } from "../../../hooks/useForm";
import { userResource } from "../../../services/users/index";
import { Select } from "../../../components/CustomInput/Select";
import { Loading } from "../../../components/Loading";

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

const options = [
  { value: "pf", label: "Cliente" },
  { value: "pj", label: "Funcionário" },
];

export const optionsBirthDate = [
  { label: "Janeiro", value: "Janeiro" },
  { label: "Fevereiro", value: "Fevereiro" },
  { label: "Março", value: "Março" },
  { label: "Abril", value: "Abril" },
  { label: "Maio", value: "Maio" },
  { label: "Junho", value: "Junho" },
  { label: "Julho", value: "Julho" },
  { label: "Agosto", value: "Agosto" },
  { label: "Setembro", value: "Setembro" },
  { label: "Outubro", value: "Outubro" },
  { label: "Novembro", value: "Novembro" },
  { label: "Dezembro", value: "Dezembro" },
];

const initialValues = {
  birthDate: "",
  name: "",
  cellPhone: "",
  type: "",
};

const useStyles = makeStyles(styles);

export function UsersForm() {
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
    requireds: ["name", "type"],
  });

  const [errors, setErrors] = useState();

  useEffect(() => {
    if (statusCreated === "success" || statusUpdated === "success") {
      history.push("/users");
    }
  }, [statusCreated, statusUpdated]);

  useEffect(() => {
    if (id) findById(id);

    setField("type", options[0]);
  }, []);

  useEffect(() => {
    if (user) {
      setAllFields({
        name: user.name,
        cellPhone: user.cellPhone,
        type: options.find((item) => item.value === user.type),
        birthDate: optionsBirthDate.find(
          (item) => item.value === user.birthDate
        ),
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
      ...fields,
      birthDate: fields.birthDate?.value,
      type: fields.type.value,
    };

    if (id) {
      return updateById(id, payload);
    }

    create(payload);
  };

  const isEditing = !!id;

  return (
    <div>
      {(statusCreated === "pending" || statusUpdated === "pending") && (
        <Loading />
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4> {isEditing ? "Atualizar" : "Novo"} Usuário </h4>
        <NavLink to="/users">
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
              <CustomInput
                id="cellPhone"
                labelText="Telefone (opcional)"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  value: fields.cellPhone,
                  onChange: (event) =>
                    setField("cellPhone", event.target.value),
                }}
              />
            </GridItem>

            <GridItem xs={12} sm={6} md={6}>
              <Select
                options={optionsBirthDate}
                placeholder="Mes de aniversáio (opcional)"
                value={fields.birthDate}
                onChange={(val) => setField("birthDate", val)}
              />
              <span style={{ fontSize: 12, color: "red" }}>
                {" "}
                {!!errors?.birthDate && errorsMessage[errors.birthDate]}{" "}
              </span>
            </GridItem>

            <GridItem xs={12} sm={6} md={6}>
              <Select
                options={options}
                value={fields.type}
                onChange={(val) => setField("type", val)}
              />
              <span style={{ fontSize: 12, color: "red" }}>
                {" "}
                {!!errors?.type && errorsMessage[errors.type]}{" "}
              </span>
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
