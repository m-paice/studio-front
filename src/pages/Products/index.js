import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import AddCircle from "@material-ui/icons/AddCircle";

import Table from "../../components/Table/Table";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import Button from "../../components/CustomButtons/Button";
import { Pagination } from "../../components/Pagination";
import { Skeleton } from "../../components/Skeleton";
import { useAsync } from "../../hooks/useAsync";
import { useToggle } from "../../hooks/useToggle";
import { productResource } from "../../services/products";
import { Modal } from "../../components/Modal";
import { Helmet } from "../../components/Helmet";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

export function Products() {
  const classes = useStyles();

  const history = useHistory();

  const { execute, value, status } = useAsync(productResource.findMany);
  const { execute: deleteById, status: statusDelete } = useAsync(
    productResource.deleteById
  );

  const [isOpen, handleChangeIsOpen] = useToggle();

  const [userId, setUserId] = useState("");

  useEffect(() => {
    execute();
  }, []);

  useEffect(() => {
    if (statusDelete === "success") execute();
  }, [statusDelete]);

  const handleDelete = (valueUserId) => {
    setUserId(valueUserId);
    handleChangeIsOpen();
  };

  const handleSubmitDelete = () => {
    deleteById(userId);
    handleChangeIsOpen();
  };

  const formatPrice = (value = 0) => {
    if (!value) return 0;

    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const nextPage = () => {
    if (value?.currentPage === value?.lastPage) return;

    execute({ page: value?.currentPage + 1 });
  };

  const previousPage = () => {
    if (value?.currentPage === 1) return;

    execute({ page: value?.currentPage - 1 });
  };

  const goToPage = (page) => {
    execute({ page });
  };

  return (
    <div>
      <Helmet title="Produtos" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4> Produtos </h4>
        <NavLink to="/products/create">
          <Button color="info">
            <AddCircle className={classes.icons} /> novo produto
          </Button>
        </NavLink>
      </div>
      <Card>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>Lista de Produtos</h4>
          <p className={classes.cardCategoryWhite}>
            acompanhe todos os seus produtos por aqui.
          </p>
        </CardHeader>
        <CardBody>
          {status === "pending" ? (
            <Skeleton lines={10} />
          ) : (
            <>
              <Table
                tableHeaderColor="info"
                tableHead={[
                  "Nome",
                  "Preço",
                  "Quantidade",
                  "Categoria",
                  "Ações",
                ]}
                tableData={(value?.data || []).map((item) => [
                  item.name,
                  formatPrice(item.price),
                  item.amount,
                  item.categoryId ? item.category.name : "",
                  <div key={item.id}>
                    <Button
                      color="warning"
                      justIcon={window.innerWidth > 959}
                      simple={!(window.innerWidth > 959)}
                      aria-label="Dashboard"
                      className={classes.buttonLink}
                      onClick={() => history.push(`/products/${item.id}/edit`)}
                    >
                      <Edit className={classes.icons} />
                    </Button>
                    <Button
                      color="danger"
                      justIcon={window.innerWidth > 959}
                      simple={!(window.innerWidth > 959)}
                      aria-label="Dashboard"
                      className={classes.buttonLink}
                      onClick={() => handleDelete(item.id)}
                    >
                      <Delete className={classes.icons} />
                    </Button>
                  </div>,
                ])}
              />

              <Pagination
                currentPage={value?.currentPage}
                lastPage={value?.lastPage}
                total={value?.total}
                nextPage={nextPage}
                previousPage={previousPage}
                goToPage={goToPage}
              />
            </>
          )}
        </CardBody>

        <Modal
          type="warning"
          onCancel={handleChangeIsOpen}
          onConfirm={handleSubmitDelete}
          title="Deseja excluir esse item ?"
          show={isOpen}
        >
          Cuidado! Não sera possível reverter essa ação!
        </Modal>
      </Card>
    </div>
  );
}
