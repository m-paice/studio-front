import React, { useEffect } from "react";

import { NavLink, useHistory, useParams } from "react-router-dom";
import Delete from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";

import GridItem from "../../../components/Grid/GridItem";
import GridContainer from "../../../components/Grid/GridContainer";
import CustomInput from "../../../components/CustomInput/CustomInput";
import Button from "../../../components/CustomButtons/Button";
import Table from "../../../components/Table/Table";
import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardBody from "../../../components/Card/CardBody";
import CardFooter from "../../../components/Card/CardFooter";
import { Select } from "../../../components/CustomInput/Select";
import { useAsync } from "../../../hooks/useAsync";
import { useForm } from "../../../hooks/useForm";
import { serviceResource } from "../../../services/services";
import { productResource } from "../../../services/products";
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
  price: "",
  type: "",
  porcent: "",
  products: [],
};

const options = [
  { label: "Integral", value: "full" },
  { label: "Parcial", value: "partial" },
];

const useStyles = makeStyles(styles);

export function ServicesForm() {
  const classes = useStyles();

  const history = useHistory();
  const { id } = useParams();

  const { execute: create, status: statusCreated } = useAsync(
    serviceResource.create
  );
  const { execute: updateById, status: statusUpdated } = useAsync(
    serviceResource.updateById
  );
  const { execute: findById, value: service } = useAsync(
    serviceResource.findById
  );

  const [fields, setField, setAllFields] = useForm({ initialValues });

  useEffect(() => {
    if (statusCreated === "success" || statusUpdated === "success") {
      history.push("/admin/services");
    }
  }, [statusCreated, statusUpdated]);

  useEffect(() => {
    if (id) findById(id);

    if (!id) {
      setField("type", options[0]);
    }
  }, []);

  useEffect(() => {
    if (service) {
      setAllFields({
        name: service.name,
        price: service.price,
        type: options.find((item) => item.value === service.type),
        porcent: service.porcent,
        products: [],
      });
    }
  }, [service]);

  const handleSubmit = () => {
    if (!fields.name) return;

    const payload = {
      ...fields,
      type: fields.type.value,
    };

    if (id) {
      return updateById(id, payload);
    }

    create(payload);
  };

  const handleAddProduct = (product) => {
    if (fields.products.find((item) => item.id === product.id)) return;

    setField("products", [...fields.products, product]);
  };

  const handleRemoveProduct = (productId) => {
    setField(
      "products",
      fields.products.filter((item) => item.id !== productId)
    );
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
        <h4> {isEditing ? "Atualizar" : "Novo"} Serviço </h4>
        <NavLink to="/admin/services">
          <Button color="info">Voltar</Button>
        </NavLink>
      </div>
      <Card>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>
            {isEditing ? "Atualizando" : "Criando"} serviço
          </h4>
          <p className={classes.cardCategoryWhite}>
            Preencha os dados do serviço
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
                id="price"
                labelText="Preço"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  required: true,
                  value: fields.price,
                  onChange: (event) => setField("price", event.target.value),
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

            <GridItem xs={12} sm={6} md={6}>
              <CustomInput
                id="porcent"
                labelText="Porcentagem"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  required: true,
                  value: fields.porcent,
                  onChange: (event) => setField("porcent", event.target.value),
                }}
              />
            </GridItem>

            <GridItem xs={12} sm={12} md={12}>
              <SelectAsync
                exec={productResource.findByName}
                clickOption={({ value }) => handleAddProduct(value)}
                placeholder="Pesquise um produto"
              />
            </GridItem>
          </GridContainer>

          {fields.products.length > 0 && (
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <Table
                    tableHeaderColor="info"
                    tableHead={["Nome", "Ações"]}
                    tableData={fields.products.map((item) => [
                      item.name,

                      <div key={item.id}>
                        <Button
                          color="danger"
                          justIcon={window.innerWidth > 959}
                          simple={!(window.innerWidth > 959)}
                          aria-label="Dashboard"
                          className={classes.buttonLink}
                          onClick={() => handleRemoveProduct(item.id)}
                        >
                          <Delete className={classes.icons} />
                        </Button>
                      </div>,
                    ])}
                  />
                </Card>
              </GridItem>
            </GridContainer>
          )}
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
