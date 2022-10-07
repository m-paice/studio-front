import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Delete from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import AddCircle from "@material-ui/icons/AddCircle";

import Table from "../../components/Table/Table";
import Card from "../../components/Card/Card";
import GridItem from "../../components/Grid/GridItem";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import Button from "../../components/CustomButtons/Button";
import { useAsync } from "../../hooks/useAsync";
import { useToggle } from "../../hooks/useToggle";
import { Modal } from "../../components/Modal";
import { serviceResource } from "../../services/services";
import { Filters } from "./Filters";

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

export function Services() {
  const classes = useStyles();

  const [userId, setUserId] = useState("");
  const [filters, setFilters] = useState();

  const [isOpen, handleChangeIsOpen] = useToggle();
  const [isOpenFilters, handleToggleOpenFilters] = useToggle();

  const history = useHistory();

  const { execute, value } = useAsync(serviceResource.findMany);
  const { execute: deleteById, status: statusDelete } = useAsync(
    serviceResource.deleteById
  );

  useEffect(() => {
    execute({
      where: {
        ...filters,
        ...(filters?.name && { name: { $like: `%${filters.name}%` } }),
      },
    });
  }, [filters?.type, filters?.name, filters?.price]);

  useEffect(() => {
    if (statusDelete === "success") execute();
  }, [statusDelete]);

  const handleDeleteUser = (valueUserId) => {
    setUserId(valueUserId);
    handleChangeIsOpen();
  };

  const handleSubmitDelete = () => {
    deleteById(userId);
    handleChangeIsOpen();
  };

  const handleSetFilters = (key, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
    handleToggleOpenFilters();
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4> Serviços </h4>
        <NavLink to="/admin/services/create">
          <Button color="info">
            <AddCircle className={classes.icons} /> novo serviço
          </Button>
        </NavLink>
      </div>
      <Card>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>Lista de Serviços</h4>
          <p className={classes.cardCategoryWhite}>
            acompanhe todos os seus serviços por aqui.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <GridItem xs={12} sm={12} md={12}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Button onClick={handleClearFilters}>
                  {" "}
                  {isOpenFilters ? "Fechar" : "Abrir"} filtros{" "}
                </Button>
              </div>
            </GridItem>
          </div>
        </CardHeader>
        <CardBody>
          {isOpenFilters && <Filters handleSetFilters={handleSetFilters} />}

          <Table
            tableHeaderColor="info"
            tableHead={["Nome", "Preço", "Tipo", "Produtos", "Ações"]}
            tableData={(value || []).map((item) => [
              item.name,
              item.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              }),
              item.type === "full" ? "Integral" : "Parcial",
              item.products.length,
              <div key={item.id}>
                <Button
                  color="warning"
                  justIcon={window.innerWidth > 959}
                  simple={!(window.innerWidth > 959)}
                  aria-label="Dashboard"
                  className={classes.buttonLink}
                  onClick={() =>
                    history.push(`/admin/services/${item.id}/edit`)
                  }
                >
                  <Edit className={classes.icons} />
                </Button>
                <Button
                  color="danger"
                  justIcon={window.innerWidth > 959}
                  simple={!(window.innerWidth > 959)}
                  aria-label="Dashboard"
                  className={classes.buttonLink}
                  onClick={() => handleDeleteUser(item.id)}
                >
                  <Delete className={classes.icons} />
                </Button>
              </div>,
            ])}
          />
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
