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
import { useAsync } from "../../hooks/useAsync";
import { useToggle } from "../../hooks/useToggle";
import { userResource } from "../../services/users";
import { Modal } from "../../components/Modal";
import format from "date-fns/format";

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

export function Users() {
  const classes = useStyles();

  const history = useHistory();

  const { execute, value } = useAsync(userResource.findMany);
  const { execute: deleteById, status: statusDelete } = useAsync(
    userResource.deleteById
  );

  const [isOpen, handleChangeIsOpen] = useToggle();

  const [userId, setUserId] = useState("");

  useEffect(() => {
    execute();
  }, []);

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

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4> Usuários </h4>
        <NavLink to="/admin/users/create">
          <Button color="info">
            <AddCircle className={classes.icons} /> novo usuário
          </Button>
        </NavLink>
      </div>
      <Card>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>Lista de Usuários</h4>
          <p className={classes.cardCategoryWhite}>
            acompanhe todos os seus usuários por aqui.
          </p>
        </CardHeader>
        <CardBody>
          <Table
            tableHeaderColor="info"
            tableHead={["Nome", "Telefone", "Tipo", "Aniversário", "Ações"]}
            tableData={(value || []).map((item) => [
              item.name,
              item.cellPhone,
              item.type === "pf" ? "Cliente" : "Funcionário",
              format(new Date(item.birthDate), "dd / MMMM"),
              <div key={item.id}>
                <Button
                  color="warning"
                  justIcon={window.innerWidth > 959}
                  simple={!(window.innerWidth > 959)}
                  aria-label="Dashboard"
                  className={classes.buttonLink}
                  onClick={() => history.push(`/admin/users/${item.id}/edit`)}
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
