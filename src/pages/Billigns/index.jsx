import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Table from "../../components/Table/Table";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import GridItem from "../../components/Grid/GridItem";
import Button from "../../components/CustomButtons/Button";
import { Skeleton } from "../../components/Skeleton";
import { Pagination } from "../../components/Pagination";
import { useAsync } from "../../hooks/useAsync";
import { useToggle } from "../../hooks/useToggle";
import { billignsResource } from "../../services/billigns";
import { Filters } from "./Filters";
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

export function Billigns() {
  const classes = useStyles();
  const history = useHistory();
  const [isOpenFilters, handleToggleOpenFilters] = useToggle();
  const [filters, setFilters] = useState({});
  const { execute, value, status } = useAsync(billignsResource.findMany);

  const defaultFilters = {
    ...(filters?.account && { accountId: filters.account.value.id }),
    ...(filters?.user && { userId: filters.user.value.id }),
    ...(filters?.method && { method: filters.method.value }),
    ...(filters?.originalUrl && {
      originalUrl: { $iLike: `%${filters.originalUrl}%` },
    }),
  };

  useEffect(() => {
    execute({
      where: defaultFilters,
    });
  }, [filters?.account, filters?.user, filters?.method, filters?.originalUrl]);

  const nextPage = () => {
    if (value?.currentPage === value?.lastPage) return;

    execute({ page: value?.currentPage + 1, where: defaultFilters });
  };

  const previousPage = () => {
    if (value?.currentPage === 1) return;

    execute({ page: value?.currentPage - 1, where: defaultFilters });
  };

  const goToPage = (page) => {
    execute({ page, where: defaultFilters });
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
      <Helmet title="Billings" />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4> Billigns </h4>
      </div>
      <Card>
        <CardHeader color="info">
          <h4 className={classes.cardTitleWhite}>Lista de billigns</h4>
          <p className={classes.cardCategoryWhite}>
            acompanhe todos os suas billigns por aqui.
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
                tableHead={[
                  "Account",
                  "User",
                  "IP Address",
                  "Method",
                  "original URL",
                  "User Agent",
                ]}
                tableData={(value?.data || []).map((item) => [
                  item?.account?.name || "ADMIN",
                  item?.user?.name || "ADMIN",
                  item.ipAddress,
                  item.method,
                  item.originalUrl,
                  item.userAgent,
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
    </div>
  );
}
