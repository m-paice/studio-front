import React from "react";

import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
import format from "date-fns/format";

import Button from "../CustomButtons/Button";

const status = {
  pending: "Pendente",
  finished: "Finalizado",
  canceled: "Cancelado",
};

export function ScheduleItem({ item, changeStatus }) {
  const history = useHistory();

  return (
    <div
      style={{
        borderBottom: "1px solid",
        marginBottom: 20,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontWeight: "bold" }}>
              {format(new Date(item.scheduleAt), "HH:mm")}{" "}
            </span>
            {item.user.name}
          </div>
          <Edit
            style={{ cursor: "pointer", color: "#ff9800" }}
            onClick={() => history.push(`/admin/schedules/${item.id}/edit`)}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {item.service.name}
          <br />
          <span>
            status:{" "}
            <span
              style={
                item.status === "canceled"
                  ? { color: "#f44336", fontWeight: "bold" }
                  : item.status === "finished"
                  ? { color: "#4caf50", fontWeight: "bold" }
                  : { fontWeight: "bold" }
              }
            >
              {status[item.status] || "Nenhum"}
            </span>
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {item.status === "pending" && (
              <>
                <Button
                  color="success"
                  justIcon={window.innerWidth > 959}
                  simple={!(window.innerWidth > 959)}
                  aria-label="Dashboard"
                  size="sm"
                  onClick={() => changeStatus(item.id, { status: "finished" })}
                >
                  <Check />
                </Button>
                <Button
                  color="danger"
                  justIcon={window.innerWidth > 959}
                  simple={!(window.innerWidth > 959)}
                  aria-label="Dashboard"
                  size="sm"
                  onClick={() => changeStatus(item.id, { status: "canceled" })}
                >
                  <Delete />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
