import React, { useEffect, useState } from "react";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Delete from "@material-ui/icons/Delete";

import GridItem from "../../../components/Grid/GridItem";
import GridContainer from "../../../components/Grid/GridContainer";
import CustomInput from "../../../components/CustomInput/CustomInput";
import Table from "../../../components/Table/Table";
import Button from "../../../components/CustomButtons/Button";
import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardBody from "../../../components/Card/CardBody";
import CardFooter from "../../../components/Card/CardFooter";
import { useAsync } from "../../../hooks/useAsync";
import { useForm } from "../../../hooks/useForm";
import { salesResource } from "../../../services/sales";
import { userResource } from "../../../services/users";
import { productResource } from "../../../services/products";
import { Skeleton } from "../../../components/Skeleton";
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
  user: "",
  products: [],
};

const errorsMessage = {
  required: "Campo obrigatório",
};

const useStyles = makeStyles(styles);

export function SalesForm() {
  const classes = useStyles();

  const history = useHistory();
  const { id } = useParams();

  const { execute: create, status: statusCreated } = useAsync(
    salesResource.create
  );
  const { execute: updateById, status: statusUpdated } = useAsync(
    salesResource.updateById
  );
  const { execute: findById, value } = useAsync(salesResource.findById);

  const [fields, setField, setAllFields, validateAllFields] = useForm({
    initialValues,
    requireds: ["user"],
  });

  const [errors, setErrors] = useState();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (statusCreated === "success" || statusUpdated === "success") {
      history.push("/sales");
    }
  }, [statusCreated, statusUpdated]);

  useEffect(() => {
    if (id) findById(id);
  }, []);

  useEffect(() => {
    if (value) {
      setAllFields({
        user: { label: value.user.name, value: value.user },
        products: value.products.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          discount: item.ProductSale.discount,
          addition: item.ProductSale.addition,
          amount: item.ProductSale.amount,
        })),
      });
    }
  }, [value]);

  useEffect(() => {
    if (fields.products.length) {
      const total = fields.products.reduce((acc, cur) => {
        const itemSubtotal =
          cur.amount * cur.price - cur.discount + cur.addition;

        return acc + itemSubtotal;
      }, 0);

      setTotal(total);
    } else {
      setTotal(0);
    }
  }, [fields.products]);

  const handleSubmit = () => {
    const validate = validateAllFields();

    if (!validate.isValid) {
      setErrors(validate.errors);
      return;
    }

    const payload = {
      userId: fields.user.value.id,
      products: fields.products,
    };

    if (id) {
      return updateById(id, payload);
    }

    create(payload);
  };

  const handleAddProduct = (product) => {
    if (!product) return;

    if (fields.products.find((item) => item.id === product.id)) return;

    setField("products", [
      ...fields.products,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        amount: 1,
        discount: 0,
        addition: 0,
      },
    ]);
  };

  const handleRemoveProduct = (productId) => {
    setField(
      "products",
      fields.products.filter((item) => item.id !== productId)
    );
  };

  const handleSetProduct = (key, name, value) => {
    setField(
      "products",
      fields.products.map((item, index) => {
        if (index === key) {
          return {
            ...item,
            [name]: Number(value),
          };
        }
        return item;
      })
    );
  };

  const isEditing = !!id;

  if (isEditing && !fields.user?.value) {
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
            <Skeleton lines={4} />
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
        <h4> {isEditing ? "Atualizar" : "Novo"} Venda </h4>
        <NavLink to="/sales">
          <Button color="info">Voltar</Button>
        </NavLink>
      </div>
      <Card>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>
            {isEditing ? "Atualizando" : "Criando"} venda
          </h4>
          <p className={classes.cardCategoryWhite}>
            Preencha os dados do venda
          </p>
        </CardHeader>
        <CardBody>
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              <SelectAsync
                exec={userResource.findByName}
                clickOption={(value) => setField("user", value)}
                placeholder="Pesquise um usuário"
                defaultValue={fields.user}
              />
              <span style={{ fontSize: 12, color: "red" }}>
                {!!errors?.user && errorsMessage[errors.user]}
              </span>
            </GridItem>

            <GridItem xs={12} sm={6} md={6}>
              <SelectAsync
                exec={productResource.findByName}
                clickOption={(value) => handleAddProduct(value?.value)}
                placeholder="Pesquise um produto"
                defaultValue={fields.product}
              />
              <span style={{ fontSize: 12, color: "red" }}>
                {!!errors?.product && errorsMessage[errors.product]}
              </span>
            </GridItem>
          </GridContainer>

          {fields.products.length > 0 && (
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <Table
                    tableHeaderColor="info"
                    tableHead={[
                      "Produto",
                      "Quantidade",
                      "Desconto",
                      "Adicional",
                      "Subtotal",
                      "Ações",
                    ]}
                    tableData={fields.products.map((item, index) => [
                      <h4 key={item.id}> {item.name} </h4>,
                      <CustomInput
                        key={item.id}
                        id="amount"
                        labelText="Quantidade"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          required: true,
                          value: item.amount,
                          type: "number",
                          onChange: (event) =>
                            handleSetProduct(
                              index,
                              "amount",
                              event.target.value
                            ),
                        }}
                      />,
                      <CustomInput
                        key={item.id}
                        id="discount"
                        labelText="Desconto"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          required: true,
                          value: item.discount,
                          type: "number",
                          defaultValue: "0",
                          onChange: (event) =>
                            handleSetProduct(
                              index,
                              "discount",
                              event.target.value
                            ),
                        }}
                      />,
                      <CustomInput
                        key={item.id}
                        id="addition"
                        labelText="Adicional"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          required: true,
                          value: item.addition,
                          type: "number",
                          defaultValue: "0",
                          onChange: (event) =>
                            handleSetProduct(
                              index,
                              "addition",
                              event.target.value
                            ),
                        }}
                      />,
                      <h4 key={item.id}>
                        R${" "}
                        {item.amount * item.price -
                          item.discount +
                          item.addition}
                      </h4>,
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <h4> Total: R$ {total} </h4>
          </div>
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
