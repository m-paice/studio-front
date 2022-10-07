import React, { useEffect } from "react";

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
import { Select } from "../../../components/CustomInput/Select.js";
import format from "date-fns/format";

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

const options = [
  { value: "pf", label: "Cliente" },
  { value: "pj", label: "Funcionário" },
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

  const [fields, setField, setAllFields] = useForm({ initialValues });

  useEffect(() => {
    if (statusCreated === "success" || statusUpdated === "success") {
      history.push("/admin/users");
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
        birthDate: format(new Date(user.birthDate), "yyyy-MM-dd"),
      });
    }
  }, [user]);

  const handleSubmit = () => {
    if (!fields.name) return;

    const payload = {
      ...fields,
      birthDate: new Date(`${fields.birthDate} 10:00:00`),
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4> {isEditing ? "Atualizar" : "Novo"} Usuário </h4>
        <NavLink to="/admin/users">
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
            </GridItem>

            <GridItem xs={12} sm={6} md={6}>
              <CustomInput
                id="birthDate"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "date",
                  value: fields.birthDate,
                  onChange: (event) =>
                    setField("birthDate", event.target.value),
                }}
              />
            </GridItem>

            <GridItem xs={12} sm={6} md={6}>
              <Select
                options={options}
                value={fields.type}
                onChange={(val) => setField("type", val)}
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
