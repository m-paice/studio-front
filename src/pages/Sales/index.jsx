import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink, useHistory } from "react-router-dom";
import AddCircle from "@material-ui/icons/AddCircle";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import RemoveRedEye from "@material-ui/icons/RemoveRedEye";

import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import Button from "../../components/CustomButtons/Button";
import Table from "../../components/Table/Table";
import { Pagination } from "../../components/Pagination";
import { Skeleton } from "../../components/Skeleton";
import { useAsync } from "../../hooks/useAsync";
import { salesResource } from "../../services/sales";
import { Helmet } from "../../components/Helmet";
import { useToggle } from "../../hooks/useToggle";
import { Modal } from "../../components/Modal";
import { formatDate } from "../../utils/formatDate";

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

export function Sales() {
  const classes = useStyles();
  const history = useHistory();

  const [selectItem, setSelectItem] = useState("");
  const [isOpen, handleChangeIsOpen] = useToggle();

  const { execute, value, status } = useAsync(salesResource.findMany);
  const { execute: deleteById, status: statusDelete } = useAsync(
    salesResource.deleteById
  );

  useEffect(() => {
    execute();
  }, []);

  useEffect(() => {
    if (statusDelete === "success") execute();
  }, [statusDelete]);

  const handleDelete = (itemId) => {
    setSelectItem(itemId);
    handleChangeIsOpen();
  };

  const handleSubmitDelete = () => {
    deleteById(selectItem);
    handleChangeIsOpen();
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

  const formatPrice = (value = 0) => {
    if (!value) return 0;

    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div>
      <Helmet title="Vendas" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4> Vendas </h4>
        <NavLink to="/sales/create">
          <Button color="info">
            <AddCircle className={classes.icons} /> nova venda
          </Button>
        </NavLink>
      </div>
      <Card>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>Lista de Vendas</h4>
          <p className={classes.cardCategoryWhite}>
            acompanhe todos as suas vendas por aqui.
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
                  "Usuário",
                  "Produtos",
                  "Preço",
                  "Pagamento",
                  "Data",
                  "Ações",
                ]}
                tableData={(value?.data || []).map((item) => [
                  item?.user?.name,
                  item.products.reduce((acc, cur) => {
                    return acc + cur.ProductSale.amount;
                  }, 0),
                  formatPrice(item.total),
                  item.payment ? (
                    <div>
                      <spa>
                        {" "}
                        {item.payment.formOfPayment === 2
                          ? "Cartão"
                          : "Dinheiro"}{" "}
                      </spa>
                      <spa> {item.payment.amountParcel}x </spa>
                      <span>
                        {" "}
                        ({formatPrice(
                          item.total / item.payment.amountParcel
                        )}){" "}
                      </span>
                    </div>
                  ) : (
                    "Nenhum"
                  ),
                  formatDate(item.createdAt),
                  <div key={item.id}>
                    <Button
                      color="info"
                      justIcon={window.innerWidth > 959}
                      simple={!(window.innerWidth > 959)}
                      aria-label="Dashboard"
                      className={classes.buttonLink}
                      onClick={() => history.push(`/sales/${item.id}/show`)}
                    >
                      <RemoveRedEye className={classes.icons} />
                    </Button>
                    <Button
                      color="warning"
                      justIcon={window.innerWidth > 959}
                      simple={!(window.innerWidth > 959)}
                      aria-label="Dashboard"
                      className={classes.buttonLink}
                      onClick={() => history.push(`/sales/${item.id}/edit`)}
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
      </Card>

      <Modal
        type="warning"
        onCancel={handleChangeIsOpen}
        onConfirm={handleSubmitDelete}
        title="Deseja excluir esse item ?"
        show={isOpen}
      >
        Cuidado! Não sera possível reverter essa ação!
      </Modal>
    </div>
  );
}
