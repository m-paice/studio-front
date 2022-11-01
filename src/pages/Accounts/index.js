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
import GridItem from "../../components/Grid/GridItem";
import Button from "../../components/CustomButtons/Button";
import { Modal } from "../../components/Modal";
import { Skeleton } from "../../components/Skeleton";
import { Pagination } from "../../components/Pagination";
import { useAsync } from "../../hooks/useAsync";
import { useToggle } from "../../hooks/useToggle";
import { accountResource } from "../../services/accounts";
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

export function Accounts() {
  const classes = useStyles();

  const history = useHistory();

  const { execute, value, status } = useAsync(accountResource.findMany);
  const { execute: deleteById, status: statusDelete, error } = useAsync(
    accountResource.deleteById
  );

  const [isOpen, handleChangeIsOpen] = useToggle();
  const [isOpenError, handleChangeIsOpenError] = useToggle();

  const [userId, setUserId] = useState("");
  const [filters, setFilters] = useState({});

  const [isOpenFilters, handleToggleOpenFilters] = useToggle();

  useEffect(() => {
    execute();
  }, []);

  useEffect(() => {
    if (statusDelete === "success") execute();
  }, [statusDelete]);

  useEffect(() => {
    if (
      error &&
      error.response.data.name === "SequelizeForeignKeyConstraintError"
    )
      handleChangeIsOpenError();
  }, [error]);

  useEffect(() => {
    execute({
      where: {
        ...(filters?.name && { name: { $like: `%${filters.name}%` } }),
      },
    });
  }, [filters?.name]);

  const handleDeleteUser = (valueUserId) => {
    setUserId(valueUserId);
    handleChangeIsOpen();
  };

  const handleSubmitDelete = () => {
    deleteById(userId);
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
        <h4> Contas </h4>
        <NavLink to="/accounts/create">
          <Button color="info">
            <AddCircle className={classes.icons} /> nova conta
          </Button>
        </NavLink>
      </div>
      <Card>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>Lista de Contas</h4>
          <p className={classes.cardCategoryWhite}>
            acompanhe todos os suas contas por aqui.
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

          {status === "pending" ? (
            <Skeleton lines={10} />
          ) : (
            <>
              <Table
                tableHeaderColor="info"
                tableHead={["Nome", "Tipo", "Ações"]}
                tableData={(value?.data || []).map((item) => [
                  item.name,
                  item.type === "sales" ? "Vendas" : "Agendamentos",
                  <div key={item.id}>
                    <Button
                      color="warning"
                      justIcon={window.innerWidth > 959}
                      simple={!(window.innerWidth > 959)}
                      aria-label="Dashboard"
                      className={classes.buttonLink}
                      onClick={() => history.push(`/accounts/${item.id}/edit`)}
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
          title="Deseja excluir esse item?"
          show={isOpen}
        >
          Cuidado! Não sera possível reverter essa ação!
        </Modal>

        <Modal
          type="error"
          onCancel={handleChangeIsOpenError}
          onConfirm={handleChangeIsOpenError}
          title="Não foi possível excluir!"
          show={isOpenError}
        >
          Esse item tem produtos vinculados
        </Modal>
      </Card>
    </div>
  );
}
