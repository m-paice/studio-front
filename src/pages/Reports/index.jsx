import React, { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import format from "date-fns/format";
import { AddCircle } from "@material-ui/icons";

import MonetizationOn from "@material-ui/icons/MonetizationOn";
import { makeStyles } from "@material-ui/core";

import Card from "../../components/Card/Card";
import CardFooter from "../../components/Card/CardFooter";
import { Skeleton } from "../../components/Skeleton";
import CardHeader from "../../components/Card/CardHeader";
import CardIcon from "../../components/Card/CardIcon";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Button from "../../components/CustomButtons/Button";
import CardBody from "../../components/Card/CardBody";
import CustomInput from "../../components/CustomInput/CustomInput";
import { useAsync } from "../../hooks/useAsync";
import { useForm } from "../../hooks/useForm";
import { useToggle } from "../../hooks/useToggle";
import { reportsResource } from "../../services/reports";
import { useAuthContext } from "../../context/Auth";

import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { Helmet } from "../../components/Helmet";
import { NavLink } from "react-router-dom";
import { ModalDialog } from "../../components/ModalDialog";
import { formatDate } from "../../utils/formatDate";

const useStyles = makeStyles(styles);

const initialValues = {
  startAt: "",
  endAt: "",
};

export function Reports() {
  const classes = useStyles();

  const { execute, value, status } = useAsync(reportsResource.reports);
  const { execute: execDestroy, status: statusDestroy } = useAsync(
    reportsResource.destroyById
  );

  const { user } = useAuthContext();
  const [isOpenEntry, handleToggleIsOpenEntry] = useToggle();
  const [isOpenOut, handleToggleIsOpenOut] = useToggle();
  const history = useHistory();

  const [fields, setField, setAllFields] = useForm(initialValues);

  const isSaleAccount = user?.account?.type === "sales";

  const handleSubmit = () => {
    const startAt = fields.startAt.split("-");
    const endAt = fields.endAt.split("-");

    const payload = {
      startAt: new Date(`${startAt[1]}-${startAt[2]}-${startAt[0]}`).setHours(
        0
      ),
      endAt: new Date(`${endAt[1]}-${endAt[2]}-${endAt[0]}`).setHours(23),
      type: isSaleAccount ? "sales" : "schedules",
    };

    execute(payload);
  };

  const handleDestroyById = (id) => {
    execDestroy(id);
  };

  const formatPrice = (value = 0) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleLoadData = () => {
    const currentDate = new Date();

    const getCurrentDay = currentDate.getDay();

    const rigth = 7 - (getCurrentDay + 1);
    const left = getCurrentDay;

    const response = [
      ...Array.from({ length: left })
        .map((item, index) => subDays(currentDate, index + 1))
        .reverse(),
      currentDate,
      ...Array.from({ length: rigth }).map((item, index) =>
        addDays(currentDate, index + 1)
      ),
    ];

    execute({
      startAt: response[0].setHours(0),
      endAt: response[6].setHours(23),
      type: isSaleAccount ? "sales" : "schedules",
    });

    setAllFields({
      startAt: format(response[0], "yyyy-MM-dd"),
      endAt: format(response[6], "yyyy-MM-dd"),
    });
  };

  useEffect(() => {
    handleLoadData();
  }, []);

  useEffect(() => {
    if (statusDestroy === "success") handleLoadData();
  }, [statusDestroy]);

  const dataEntry = value?.data.filter((item) => Boolean(item.entry)) || [];
  const dataOut = value?.data.filter((item) => Boolean(item.out)) || [];

  const valueEntry = dataEntry.reduce((acc, cur) => acc + cur.entry, 0);
  const valueOut = dataOut.reduce((acc, cur) => acc + cur.out, 0);

  return (
    <div>
      <Helmet title="Relatórios" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4> Relatórios </h4>
        <NavLink to="/reports/create">
          <Button color="info">
            <AddCircle className={classes.icons} /> registro de saída
          </Button>
        </NavLink>
      </div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Relatórios</h4>
              <p className={classes.cardCategoryWhite}>
                Escolha os filtros para buscar seus relatórios
              </p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={6} sm={6} md={6}>
                  <CustomInput
                    id="startAt"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "date",
                      value: fields.startAt,
                      onChange: (event) =>
                        setField("startAt", event.target.value),
                    }}
                  />
                </GridItem>
                <GridItem xs={6} sm={6} md={6}>
                  <CustomInput
                    id="endAt"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      type: "date",
                      value: fields.endAt,
                      onChange: (event) =>
                        setField("endAt", event.target.value),
                    }}
                  />
                </GridItem>
              </GridContainer>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleSubmit}> Buscar relatório </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={6} md={6}>
          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              {status === "pending" ? (
                <div style={{ marginBottom: 60 }}>
                  <Skeleton lines={2} />
                </div>
              ) : (
                <Card>
                  <CardHeader color="success" stats icon>
                    <CardIcon color="success">
                      <MonetizationOn />
                    </CardIcon>
                    <p className={classes.cardCategory}>Entradas</p>
                    <h3 className={classes.cardTitle}>
                      {formatPrice(valueEntry || 0)}
                    </h3>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={classes.stats}></div>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={handleToggleIsOpenEntry}
                    >
                      Ver mais
                    </a>
                  </CardFooter>
                </Card>
              )}
            </GridItem>

            <GridItem xs={12} sm={6} md={6}>
              {status === "pending" ? (
                <div style={{ marginBottom: 60 }}>
                  <Skeleton lines={2} />
                </div>
              ) : (
                <Card>
                  <CardHeader color="danger" stats icon>
                    <CardIcon color="danger">
                      <MonetizationOn />
                    </CardIcon>
                    <p className={classes.cardCategory}>Saídas</p>
                    <h3 className={classes.cardTitle}>
                      {formatPrice(valueOut || 0)}
                    </h3>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={classes.stats}></div>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={handleToggleIsOpenOut}
                    >
                      Ver mais
                    </a>
                  </CardFooter>
                </Card>
              )}
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>

      <ModalDialog
        title="Relatório de entradas"
        isOpen={isOpenEntry}
        handleToggle={handleToggleIsOpenEntry}
        size="md"
      >
        <div style={{ padding: 7 }}>
          {dataEntry.map((item) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e6e6e6",
                marginBottom: 20,
                paddingRight: 15,
              }}
              key={item.id}
            >
              <div
                style={{
                  display: "flex",
                  gap: 20,
                }}
              >
                <span>{formatDate(item.createdAt)}</span>
                <span>{item.schedule?.user?.name || "Desconhecido"}</span>
                {item.schedule.services.map((item) => item.name).join(" - ")}
              </div>
              <span>{formatPrice(item.entry)}</span>
            </div>
          ))}
        </div>
      </ModalDialog>

      <ModalDialog
        title="Relatório de saídas"
        isOpen={isOpenOut}
        handleToggle={handleToggleIsOpenOut}
        size="md"
      >
        <div style={{ overflowY: "auto" }}>
          {dataOut.map((item) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e6e6e6",
                marginBottom: 20,
                paddingRight: 15,
              }}
              key={item.id}
            >
              <div
                style={{
                  display: "flex",
                  gap: 20,
                }}
              >
                <span>{formatDate(item.createdAt)}</span>
                <span>{item.description}</span>
              </div>
              <span>{formatPrice(item.out)}</span>
            </div>
          ))}
        </div>
      </ModalDialog>
    </div>
  );
}
