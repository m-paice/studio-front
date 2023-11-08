import React, { useEffect, useState } from "react";

import format from "date-fns/format";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import GridItem from "../../../components/Grid/GridItem";
import GridContainer from "../../../components/Grid/GridContainer";
import CustomInput from "../../../components/CustomInput/CustomInput";
import Button from "../../../components/CustomButtons/Button";
import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/Card/CardHeader";
import CardBody from "../../../components/Card/CardBody";
import CardFooter from "../../../components/Card/CardFooter";
import { Skeleton } from "../../../components/Skeleton";
import { SelectAsync } from "../../../components/CustomInput/SelectAsync";
import { Loading } from "../../../components/Loading";
import { useAsync } from "../../../hooks/useAsync";
import { useToggle } from "../../../hooks/useToggle";
import { useForm } from "../../../hooks/useForm";
import { userResource } from "../../../services/users/index";
import { serviceResource } from "../../../services/services";
import { scheduleResource } from "../../../services/schedules";
import { Modal } from "../../../components/Modal";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);

const errorsMessage = {
  required: "Campo obrigatório",
};

const initialValues = {
  user: "",
  service: "",
  employee: "",
  date: "",
  time: "",
  isPackage: false,
  discount: 0,
  addition: 0,
};

export function SchedulesForm() {
  const classes = useStyles();

  const history = useHistory();

  const { id } = useParams();

  const { execute: create, status: statusCreated } = useAsync(
    scheduleResource.create
  );
  const { execute: updateById, status: statusUpdated } = useAsync(
    scheduleResource.updateById
  );
  const { execute: findById, value, status: statusFind } = useAsync(
    scheduleResource.findById
  );

  const { execute: revertById, status: statusRevert } = useAsync(
    scheduleResource.revert
  );

  const [fields, setField, setAllFields, validateAllFields] = useForm({
    initialValues,
    requireds: ["user", "service", "employee", "date", "time"],
  });

  const [errors, setErrors] = useState();

  const [isOpen, setIsOpen] = useToggle();

  useEffect(() => {
    if (
      statusCreated === "success" ||
      statusUpdated === "success" ||
      statusRevert === "success"
    ) {
      history.push("/schedules");
    }
  }, [statusCreated, statusUpdated, statusRevert]);

  useEffect(() => {
    if (id) findById(id);
  }, []);

  useEffect(() => {
    if (value) {
      setAllFields({
        user: value?.user ? { label: value.user.name, value: value.user } : {},
        service: value?.services.length
          ? { label: value.services[0]?.name, value: value.services[0] }
          : {},
        employee: value?.employee
          ? { label: value.employee.name, value: value.employee }
          : {},
        date: format(new Date(value.scheduleAt), "yyyy-MM-dd"),
        time: format(new Date(value.scheduleAt), "HH:mm"),
        isPackage: value.services[0].ServiceSchedule.isPackage,
        discount: value.discount,
        addition: value.addition,
      });
    }
  }, [value]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const validate = validateAllFields();

    console.log(validate);

    if (!validate.isValid) {
      setErrors(validate.errors);
      return;
    }

    const scheduleAt = new Date(`${fields.date} ${fields.time}`);

    const payload = {
      ...fields,
      userId: fields.user.value.id,
      employeeId: fields.employee.value.id,
      services: [{ id: fields.service.value.id, isPackage: fields.isPackage }],
      scheduleAt,
    };

    if (id) {
      return updateById(id, payload);
    }

    create(payload);
  };

  const handleSubmitRevert = () => {
    revertById(id);

    setIsOpen();
  };

  const isEditing = !!id;

  if (statusFind === "pending") {
    return (
      <div>
        <h4>
          <Skeleton />
        </h4>
        <Card>
          <CardHeader color="info">
            <Skeleton lines={2} />
          </CardHeader>
          <CardBody>
            <Skeleton lines={4} />
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {(statusCreated === "pending" || statusUpdated === "pending") && (
        <Loading />
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4> {isEditing ? "Atualizar" : "Novo"} Agendamento </h4>
        <NavLink to="/schedules">
          <Button color="info">Voltar</Button>
        </NavLink>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>
              {isEditing ? "Atualizando" : "Criando"} agendamento
            </h4>
            <p className={classes.cardCategoryWhite}>
              Preencha os dados do agendamento
            </p>
          </CardHeader>
          <CardBody>
            <GridContainer>
              <GridItem xs={12} sm={4} md={4}>
                <SelectAsync
                  exec={userResource.findByName}
                  clickOption={(value) => setField("user", value)}
                  placeholder="Pesquise um usuário"
                  defaultValue={
                    isEditing
                      ? { label: value?.user?.name, value: value?.user }
                      : null
                  }
                />
                <span style={{ fontSize: 12, color: "red" }}>
                  {!!errors?.user && errorsMessage[errors.user]}
                </span>
              </GridItem>

              <GridItem xs={12} sm={4} md={4}>
                <SelectAsync
                  exec={serviceResource.findByName}
                  clickOption={(value) => setField("service", value)}
                  placeholder="Pesquise um serviço"
                  defaultValue={
                    isEditing
                      ? {
                          label: value?.services[0]?.name,
                          value: value?.services[0],
                        }
                      : null
                  }
                />
                <span style={{ fontSize: 12, color: "red" }}>
                  {!!errors?.service && errorsMessage[errors.service]}
                </span>
              </GridItem>

              <GridItem xs={12} sm={4} md={4}>
                <SelectAsync
                  exec={userResource.findEmployeeByName}
                  clickOption={(value) => setField("employee", value)}
                  placeholder="Pesquise um funcionário"
                  defaultValue={
                    isEditing
                      ? { label: value?.employee?.name, value: value?.employee }
                      : null
                  }
                />
                <span style={{ fontSize: 12, color: "red" }}>
                  {!!errors?.employee && errorsMessage[errors.employee]}
                </span>
              </GridItem>

              <GridItem xs={6} sm={6} md={6}>
                <CustomInput
                  id="date"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "date",
                    value: fields.date,
                    onChange: (event) => setField("date", event.target.value),
                    required: true,
                  }}
                />
                <span style={{ fontSize: 12, color: "red" }}>
                  {!!errors?.date && errorsMessage[errors.date]}
                </span>
              </GridItem>

              <GridItem xs={6} sm={6} md={6}>
                <CustomInput
                  id="time"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "time",
                    value: fields.time,
                    onChange: (event) => setField("time", event.target.value),
                    required: true,
                  }}
                />
                <span style={{ fontSize: 12, color: "red" }}>
                  {!!errors?.time && errorsMessage[errors.time]}
                </span>
              </GridItem>

              <GridItem xs={6} sm={6} md={6}>
                <label htmlFor="package">
                  <input
                    type="checkbox"
                    id="package"
                    value={fields.isPackage}
                    checked={fields.isPackage}
                    onChange={(event) =>
                      setField("isPackage", event.target.checked)
                    }
                    style={{ marginTop: 27, paddingBottom: 10 }}
                  />
                  É uma sessão de pacote?
                </label>
              </GridItem>

              <GridItem xs={6} sm={3} md={3}>
                <CustomInput
                  id="discount"
                  labelText="Desconto"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "number",
                    value: fields.discount,
                    onChange: (event) =>
                      setField("discount", event.target.value),
                  }}
                />
              </GridItem>
              <GridItem xs={6} sm={3} md={3}>
                <CustomInput
                  id="addition"
                  labelText="Adicional"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    type: "number",
                    value: fields.addition,
                    onChange: (event) =>
                      setField("addition", event.target.value),
                  }}
                />
              </GridItem>
            </GridContainer>
          </CardBody>
          <CardFooter>
            <Button color="info" type="submit" onClick={handleSubmit}>
              {isEditing ? "Atualizar" : "Cadastrar"}
            </Button>

            {isEditing && value?.status !== "pending" && (
              <p>
                {" "}
                Esse agendamento já foi finalizado,{" "}
                <a href="#" onClick={setIsOpen}>
                  {" "}
                  deseja reverter essa ação?{" "}
                </a>{" "}
              </p>
            )}
          </CardFooter>
        </form>
      </Card>

      <Modal
        type="warning"
        onCancel={setIsOpen}
        onConfirm={handleSubmitRevert}
        title="Deseja reverter esse item ?"
        show={isOpen}
      >
        Cuidado! Você ira perder os relatórios desse agendamento!
      </Modal>
    </div>
  );
}
