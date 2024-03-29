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
import { Loading } from "../../../components/Loading";
import { SelectAsync } from "../../../components/CustomInput/SelectAsync";
import { formatPrice } from "../../../utils/formatPrice";

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
  formOfPayment: null,
  amountParcel: null,
  isParcel: false,
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

  const isEditing = !!id;

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
        user: value?.user ? { label: value.user.name, value: value.user } : {},
        products: value.products.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          avaliable: item.amount,
          discount: item.ProductSale.discount,
          addition: item.ProductSale.addition,
          amount: item.ProductSale.amount,
        })),
        formOfPayment: value.payment?.formOfPayment || null,
        amountParcel: value.payment?.amountParcel || null,
        isParcel: value.payment?.amountParcel > 1 ? "1" : "2",
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

    const checkAvaliableProducts =
      fields.products.length &&
      fields.products.some((item) => {
        return item.amount > item.avaliable;
      });

    if (!isEditing && checkAvaliableProducts) {
      setErrors({
        avaliable: fields.products.filter(
          (item) => item.amount > item.avaliable
        ),
      });

      return;
    }

    const payload = {
      userId: fields.user.value.id,
      products: fields.products,
      formOfPayment: fields.formOfPayment || 1, // ou a vista
      amountParcel:
        fields.isParcel && fields.isParcel == 2 ? 1 : fields.amountParcel,
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
        avaliable: product.amount,
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

  if (isEditing && !value?.user) {
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
                defaultValue={
                  isEditing
                    ? { label: value.user.name, value: value.user }
                    : null
                }
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
                defaultValue={null}
              />
              <span style={{ fontSize: 12, color: "red" }}>
                {!!errors?.product && errorsMessage[errors.product]}
              </span>
            </GridItem>
          </GridContainer>

          {total > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <b> Forma de pagamento </b>
                <label htmlFor="form_pgt_cartao">
                  <input
                    type="radio"
                    name="form_pgt"
                    id="form_pgt_cartao"
                    value="2"
                    onChange={(e) => setField("formOfPayment", e.target.value)}
                    checked={fields.formOfPayment == 2}
                  />{" "}
                  Cartão
                </label>

                <label htmlFor="form_pgt_dinheiro">
                  <input
                    type="radio"
                    name="form_pgt"
                    id="form_pgt_dinheiro"
                    value="1"
                    onChange={(e) => setField("formOfPayment", e.target.value)}
                    checked={fields.formOfPayment == 1}
                  />{" "}
                  A vista
                </label>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <b> Parcelado </b>

                <label htmlFor="parcelado_sim">
                  <input
                    type="radio"
                    name="parcelado"
                    id="parcelado_sim"
                    value="1"
                    onChange={(e) => setField("isParcel", e.target.value)}
                    checked={fields.isParcel == 1}
                  />{" "}
                  SIM
                </label>

                <label htmlFor="parcelado_nao">
                  <input
                    type="radio"
                    name="parcelado"
                    id="parcelado_nao"
                    value="2"
                    onChange={(e) => setField("isParcel", e.target.value)}
                    checked={fields.isParcel == 2}
                  />{" "}
                  NÃO
                </label>
              </div>

              {fields.isParcel && fields.isParcel === "1" && (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <b> Quantidade de parcelas </b>

                  <input
                    type="number"
                    onChange={(e) => setField("amountParcel", e.target.value)}
                    value={fields.amountParcel}
                  />

                  <div>
                    <b> Subtotal: </b>{" "}
                    {formatPrice(total / Number(fields.amountParcel))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <h4> Total: {formatPrice(total)} </h4>
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
