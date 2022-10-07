import React, { useEffect } from "react";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import format from "date-fns/format";

import MonetizationOn from "@material-ui/icons/MonetizationOn";
import Schedule from "@material-ui/icons/Schedule";
import AccountBox from "@material-ui/icons/AccountBox";
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
import Table from "../../components/Table/Table";
import CustomInput from "../../components/CustomInput/CustomInput";
import { useAsync } from "../../hooks/useAsync";
import { useForm } from "../../hooks/useForm";
import { reportsResource } from "../../services/reports";

import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

const initialValues = {
  startAt: "",
  endAt: "",
};

export function Reports() {
  const classes = useStyles();

  const { execute, value, status } = useAsync(reportsResource.reports);

  const [fields, setField, setAllFields] = useForm(initialValues);

  const handleSubmit = () => {
    const payload = {
      startAt: new Date(fields.startAt),
      endAt: new Date(fields.endAt),
    };

    execute(payload);
  };

  const formatPrice = (value = 0) => {
    if (!value) return 0;

    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  useEffect(() => {
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

    execute({ startAt: response[0], endAt: response[6] });

    setAllFields({
      startAt: format(response[0], "yyyy-MM-dd"),
      endAt: format(response[6], "yyyy-MM-dd"),
    });
  }, []);

  return (
    <div>
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
                      {formatPrice(value?.entry.total)}
                    </h3>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={classes.stats}></div>
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
                      {formatPrice(value?.out.total)}
                    </h3>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={classes.stats}></div>
                  </CardFooter>
                </Card>
              )}
            </GridItem>
          </GridContainer>

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
                      <Schedule />
                    </CardIcon>
                    <p className={classes.cardCategory}>
                      Agendamentos confirmados
                    </p>
                    <h3 className={classes.cardTitle}>
                      {value?.countFinished || 0}
                    </h3>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={classes.stats}></div>
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
                      <Schedule />
                    </CardIcon>
                    <p className={classes.cardCategory}>
                      Agendamentos cancelados
                    </p>
                    <h3 className={classes.cardTitle}>
                      {value?.countCanceled || 0}
                    </h3>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={classes.stats}></div>
                  </CardFooter>
                </Card>
              )}
            </GridItem>
          </GridContainer>

          <GridContainer>
            <GridItem xs={12} sm={6} md={6}>
              {status === "pending" ? (
                <div style={{ marginBottom: 60 }}>
                  <Skeleton lines={2} />
                </div>
              ) : (
                <Card>
                  <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                      <AccountBox />
                    </CardIcon>
                    <p className={classes.cardCategory}>Novos clientes</p>
                    <h3 className={classes.cardTitle}>
                      {" "}
                      {value?.countUsers || 0}
                    </h3>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={classes.stats}></div>
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
                  <CardHeader color="info" stats icon>
                    <CardIcon color="info">
                      <MonetizationOn />
                    </CardIcon>
                    <p className={classes.cardCategory}>
                      Sugestão compra de produtos
                    </p>
                    <h3 className={classes.cardTitle}>
                      {" "}
                      {formatPrice(value?.productPriceSugestion)}
                    </h3>
                  </CardHeader>
                  <CardFooter stats>
                    <div className={classes.stats}></div>
                  </CardFooter>
                </Card>
              )}
            </GridItem>
          </GridContainer>
        </GridItem>

        <GridItem xs={12} sm={6} md={6}>
          {status === "pending" ? (
            <Skeleton lines={5} />
          ) : (
            <Card>
              <CardHeader color="warning">
                <h4 className={classes.cardTitleWhite}>
                  Serviços mais procurados
                </h4>
                <p className={classes.cardCategoryWhite}>
                  acompanhe os serviços mais procuras
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="warning"
                  tableHead={["Posição", "Nome", "Quantidade"]}
                  tableData={
                    value?.serviceCount.map((item, index) => [
                      index + 1,
                      item.name,
                      item.value,
                    ]) || []
                  }
                />
              </CardBody>
            </Card>
          )}
        </GridItem>
      </GridContainer>
    </div>
  );
}
