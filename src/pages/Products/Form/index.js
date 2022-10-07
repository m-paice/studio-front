import React, { useEffect } from "react";

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
import { Skeleton } from "../../../components/Skeleton";
import { useAsync } from "../../../hooks/useAsync";
import { useForm } from "../../../hooks/useForm";
import { productResource } from "../../../services/products";
import { categoryResource } from "../../../services/categories";
import { SelectAsync } from "../../../components/CustomInput/SelectAsync";

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
  name: "",
  price: 0,
  amount: 0,
  category: null,
};

const useStyles = makeStyles(styles);

export function ProductsForm() {
  const classes = useStyles();

  const history = useHistory();
  const { id } = useParams();

  const { execute: create, status: statusCreated } = useAsync(
    productResource.create
  );
  const { execute: updateById, status: statusUpdated } = useAsync(
    productResource.updateById
  );
  const { execute: findById, value, status } = useAsync(
    productResource.findById
  );

  const [fields, setField, setAllFields] = useForm({ initialValues });

  useEffect(() => {
    if (statusCreated === "success" || statusUpdated === "success") {
      history.push("/admin/products");
    }
  }, [statusCreated, statusUpdated]);

  useEffect(() => {
    if (id) findById(id);
  }, []);

  useEffect(() => {
    if (value) {
      setAllFields({
        name: value.name,
        price: value.price,
        amount: value.amount,
        category: value.category
          ? { label: value.category.name, value: value.category }
          : { label: "Nenhuma categoria encontrada", value: "" },
      });
    }
  }, [value]);

  const handleSubmit = () => {
    if (!fields.name) return;

    const payload = {
      name: fields.name,
      price: fields.price,
      amount: fields.amount,
      ...(fields.category?.value && { categoryId: fields.category.value.id }),
    };

    if (id) {
      return updateById(id, payload);
    }

    create(payload);
  };

  const isEditing = !!id;

  if (isEditing && !fields.category) {
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
        <h4> {isEditing ? "Atualizar" : "Novo"} Produto </h4>
        <NavLink to="/admin/products">
          <Button color="info">Voltar</Button>
        </NavLink>
      </div>
      <Card>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>
            {isEditing ? "Atualizando" : "Criando"} produto
          </h4>
          <p className={classes.cardCategoryWhite}>
            Preencha os dados do produto
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
              <SelectAsync
                exec={categoryResource.findByName}
                clickOption={(value) => setField("category", value)}
                placeholder="Pesquise uma categoria"
                defaultValue={fields.category}
              />
            </GridItem>

            <GridItem xs={12} sm={6} md={6}>
              <CustomInput
                id="price"
                labelText="Preço"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "number",
                  required: true,
                  value: fields.price,
                  onChange: (event) => setField("price", event.target.value),
                }}
              />
            </GridItem>

            <GridItem xs={12} sm={6} md={6}>
              <CustomInput
                id="amount"
                labelText="Quantidade"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  type: "number",
                  required: true,
                  value: fields.amount,
                  onChange: (event) => setField("amount", event.target.value),
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
