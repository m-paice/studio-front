import React, { useState } from "react";
import { getMonth, getWeeksInMonth, getYear, lastDayOfMonth } from "date-fns";

import { formatDate } from "../../utils/formatDate";
import { useToggle } from "../../hooks/useToggle";
import { Loading } from "../../components/Loading";
import { makeStyles } from "@material-ui/core";
import { ModalDialog } from "../ModalDialog";
import { ScheduleItem } from "../ScheduleItem";
import { useEffect } from "react";

const colors = {
  warning: "#ff9800",
  danger: "#f44336",
  success: "#4caf50",
};
const badge = (type) => {
  return {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: colors[type],
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
};

const styles = {
  days: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
  line: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    marginBottom: 2,
  },
  column: {
    border: "1px solid #e6e6e6",
    width: "100%",
    height: 100,
    cursor: "pointer",
    transition: "0.5s",
    "&:hover": {
      backgroundColor: "#e6e6e6",
    },
  },
  count: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "linear-gradient(60deg, #26c6da, #00acc1)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const useStyles = makeStyles(styles);

const daysOfWeek = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

const months = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function Month({ data, changeStatus }) {
  const classes = useStyles();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState("");

  const [isOpen, changeIsOpen] = useToggle();

  useEffect(() => {
    if (selectedDay && handleScheduleOfDay(selectedDay).length > 0)
      changeIsOpen();
  }, [selectedDay]);

  const month = getMonth(selectedDate) + 1;
  const year = getYear(selectedDate);
  const firstDayOfMonth = new Date(`${month}-01-${year}`).getDay();

  const getWeeks = getWeeksInMonth(selectedDate);
  const lastDay = lastDayOfMonth(selectedDate).getDate();

  const handleFormatDate = (day, format = "dd/MM/yyyy") => {
    return formatDate(`${month}-${day}-${year}`, format);
  };

  const handleScheduleOfDay = (day) => {
    return data.filter(
      (item) => handleFormatDate(day) === formatDate(item.scheduleAt)
    );
  };

  const handleCheckScheduleOfDay = (day, status) => {
    return (
      data.filter(
        (item) =>
          item.status === status &&
          handleFormatDate(day) === formatDate(item.scheduleAt)
      ).length || null
    );
  };

  if (!data) return <Loading />;

  return (
    <div>
      <div>
        <b> Selecione um mês </b>
        <input
          type="date"
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: 20,
            margin: "15px 0",
          }}
        >
          {" "}
          {months[month - 1]}{" "}
        </span>
      </div>

      <div className={classes.days}>
        {daysOfWeek.map((item) => (
          <div key={item}> {item} </div>
        ))}
      </div>
      {Array.from({ length: getWeeks }).map((_, line) => (
        <div key={line} className={classes.line}>
          {daysOfWeek.map((item, column) => {
            if (line === 0) {
              return (
                <div
                  key={item}
                  className={classes.column}
                  onClick={() => setSelectedDay(column + 1 - firstDayOfMonth)}
                >
                  {column < firstDayOfMonth ? null : (
                    <div style={{ padding: 5 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>
                          {column + 1 - firstDayOfMonth}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 12,
                          height: 50,
                        }}
                      >
                        {handleCheckScheduleOfDay(
                          column + 1 + line * 7 - firstDayOfMonth,
                          "pending"
                        ) > 0 && (
                          <span style={badge("warning")}>
                            {handleCheckScheduleOfDay(
                              column + 1 + line * 7 - firstDayOfMonth,
                              "pending"
                            )}
                          </span>
                        )}
                        {handleCheckScheduleOfDay(
                          column + 1 + line * 7 - firstDayOfMonth,
                          "finished"
                        ) > 0 && (
                          <span style={badge("success")}>
                            {handleCheckScheduleOfDay(
                              column + 1 + line * 7 - firstDayOfMonth,
                              "finished"
                            )}
                          </span>
                        )}

                        {handleCheckScheduleOfDay(
                          column + 1 + line * 7 - firstDayOfMonth,
                          "canceled"
                        ) > 0 && (
                          <span style={badge("danger")}>
                            {handleCheckScheduleOfDay(
                              column + 1 + line * 7 - firstDayOfMonth,
                              "canceled"
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={item}
                className={classes.column}
                onClick={() =>
                  setSelectedDay(column + 1 + line * 7 - firstDayOfMonth)
                }
              >
                {column + 1 + line * 7 - firstDayOfMonth > lastDay ? null : (
                  <div style={{ padding: 5 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        {column + 1 + line * 7 - firstDayOfMonth}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        height: 50,
                      }}
                    >
                      {handleCheckScheduleOfDay(
                        column + 1 + line * 7 - firstDayOfMonth,
                        "pending"
                      ) > 0 && (
                        <span style={badge("warning")}>
                          {handleCheckScheduleOfDay(
                            column + 1 + line * 7 - firstDayOfMonth,
                            "pending"
                          )}
                        </span>
                      )}
                      {handleCheckScheduleOfDay(
                        column + 1 + line * 7 - firstDayOfMonth,
                        "finished"
                      ) > 0 && (
                        <span style={badge("success")}>
                          {handleCheckScheduleOfDay(
                            column + 1 + line * 7 - firstDayOfMonth,
                            "finished"
                          )}
                        </span>
                      )}

                      {handleCheckScheduleOfDay(
                        column + 1 + line * 7 - firstDayOfMonth,
                        "canceled"
                      ) > 0 && (
                        <span style={badge("danger")}>
                          {handleCheckScheduleOfDay(
                            column + 1 + line * 7 - firstDayOfMonth,
                            "canceled"
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <p style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={badge("warning")} /> agendamento pendentes
        </p>
        <p style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={badge("success")} /> agendamento finalizados
        </p>
        <p style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={badge("danger")} /> agendamento cancelados
        </p>
      </div>

      <ModalDialog
        isOpen={isOpen}
        handleToggle={changeIsOpen}
        size="lg"
        handleClear={() => setSelectedDay("")}
        title={`Agendamentos do dia ${
          selectedDay && handleFormatDate(selectedDay, "dd/MMMM")
        }`}
      >
        {selectedDay &&
          handleScheduleOfDay(selectedDay)
            .sort((a, b) => (a.scheduleAt > b.scheduleAt ? 1 : -1))
            .map((item) => (
              <ScheduleItem
                key={item.id}
                item={item}
                changeStatus={changeStatus}
              />
            ))}
      </ModalDialog>
    </div>
  );
}
