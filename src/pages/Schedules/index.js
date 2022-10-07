import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { addDays, subDays, format } from "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import AddCircle from "@material-ui/icons/AddCircle";

import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";

import CardBody from "../../components/Card/CardBody";
import Button from "../../components/CustomButtons/Button";
import GridItem from "../../components/Grid/GridItem";
import GridContainer from "../../components/Grid/GridContainer";
import { ScheduleItem } from "../../components/ScheduleItem";
import { useAsync } from "../../hooks/useAsync";
import { useToggle } from "../../hooks/useToggle";
import { scheduleResource } from "../../services/schedules";
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

const daysOfWeek = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

const useStyles = makeStyles(styles);

export function Schedules() {
  const classes = useStyles();

  const [date, setDate] = useState(new Date());
  const [dateOfWeek, setDateOfWeek] = useState([]);
  const [data, setData] = useState({});
  const [filters, setFilters] = useState();

  const [isOpenFilters, handleToggleOpenFilters] = useToggle();

  const { execute, value } = useAsync(scheduleResource.findMany);
  const { execute: changeStatus, status: statusChanged } = useAsync(
    scheduleResource.changeStatus
  );

  useEffect(() => {
    if (value) {
      const response = value.reduce((acc, cur) => {
        const formatDate = format(new Date(cur.scheduleAt), "dd/MM/yyyy");

        return {
          ...acc,
          [formatDate]: [...(acc[formatDate] || []), cur],
        };
      }, {});

      setData(response);
    }
  }, [value]);

  useEffect(() => {
    const currentDate = date;

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

    setDateOfWeek(response);
  }, [date]);

  useEffect(() => {
    if (statusChanged === "success") {
      execute();
    }
  }, [statusChanged]);

  useEffect(() => {
    execute({
      where: {
        ...filters,
      },
    });
  }, [
    filters?.userId,
    filters?.employeeId,
    filters?.status,
    filters?.serviceId,
  ]);

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
        <h4> Agendamentos </h4>
        <NavLink to="/admin/schedules/create">
          <Button color="info">
            <AddCircle className={classes.icons} /> novo agendamento
          </Button>
        </NavLink>
      </div>
      <Card>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>Lista de Agendamentos</h4>
          <p className={classes.cardCategoryWhite}>
            acompanhe todos os seus agendamentos por aqui.
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

          <GridContainer>
            <GridItem>
              Visualizar semana{" "}
              <input
                type="date"
                onChange={(event) => setDate(new Date(event.target.value))}
              />
            </GridItem>
          </GridContainer>

          <h4> Agendamentos da semana </h4>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            {daysOfWeek.map((item, index) => {
              return (
                <div
                  key={index}
                  style={{
                    width: "100%",
                    height: 700,
                    overflowY: "auto",
                    background: "#eeeeee",
                    padding: 5,
                    borderRadius: 10,
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      display: "flex",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <span> {item} </span>
                    <span>
                      {" "}
                      {dateOfWeek.length &&
                        format(dateOfWeek[index], "dd/MM")}{" "}
                    </span>
                  </div>

                  <div>
                    {dateOfWeek.length &&
                      data.hasOwnProperty(
                        format(dateOfWeek[index], "dd/MM/yyyy")
                      ) &&
                      data[format(dateOfWeek[index], "dd/MM/yyyy")]
                        .sort((a, b) => (a.scheduleAt > b.scheduleAt ? 1 : -1))
                        .map((item) => (
                          <ScheduleItem
                            key={item.id}
                            item={item}
                            changeStatus={changeStatus}
                          />
                        ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
