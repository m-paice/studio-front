import React, { useEffect, useState } from "react";
import Code from "@material-ui/icons/Code";

import CustomTabs from "../../components/CustomTabs/CustomTabs";
import Button from "../../components/CustomButtons/Button";
import GridItem from "../../components/Grid/GridItem";
import GridContainer from "../../components/Grid/GridContainer";
import CustomInput from "../../components/CustomInput/CustomInput";
import { useForm } from "../../hooks/useForm";
import { useAsync } from "../../hooks/useAsync";
import { userResource } from "../../services/users";
import { useAuthContext } from "../../context/Auth";
import { Modal } from "../../components/Modal";
import { useToggle } from "../../hooks/useToggle";
import { Helmet } from "../../components/Helmet";

const errorsMessage = {
  required: "Campo obrigatório",
};

const initialValues = {
  oldPassword: "",
  newPassword: "",
  newPasswordRepet: "",
};

export function Profile() {
  const { user } = useAuthContext();

  const { execute, status, error } = useAsync(userResource.resetPassword);

  const [errors, setErrors] = useState();
  const [isOpen, handleChangeIsOpen] = useToggle();
  const [isOpenError, handleChangeIsOpenError] = useToggle();

  useEffect(() => {
    if (status === "success") {
      handleChangeIsOpen();
    }
  }, [status]);

  useEffect(() => {
    const userNotFound = error?.response?.data?.includes("user not found");

    if (userNotFound) {
      handleChangeIsOpenError();
    }
  }, [error]);

  const [
    values,
    handleSetValue,
    handleSetAllValues,
    validateAllFields,
  ] = useForm({
    initialValues,
    requireds: ["oldPassword", "newPassword", "newPasswordRepet"],
  });

  const handleSubmit = () => {
    const validate = validateAllFields();

    if (!validate.isValid) {
      setErrors(validate.errors);
      return;
    }

    if (values.newPassword !== values.newPasswordRepet) {
      setErrors({ password: "As senhas devem ser iguais" });
      return;
    }

    execute({
      cellPhone: user.cellPhone,
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <div>
      <Helmet title="Perfil" />
      <CustomTabs
        title="Perfil"
        headerColor="primary"
        rtlActive
        tabs={[
          {
            tabName: "Dados da conta",
            tabIcon: Code,
            tabContent: (
              <GridContainer>
                <GridItem xs={12} sm={6} md={6}>
                  <h4> Nome da conta: {user?.account?.name} </h4>
                  <h4>
                    {" "}
                    Atividade:{" "}
                    {user?.account?.type === "sales"
                      ? "Vendas"
                      : "Agendamentos"}{" "}
                  </h4>
                </GridItem>
              </GridContainer>
            ),
          },
          {
            tabName: "Dados pessoais",
            tabIcon: Code,
            tabContent: (
              <div>
                <h4> Trocar senha </h4>

                <GridContainer>
                  <GridItem xs={12} sm={6} md={6}>
                    <CustomInput
                      id="oldPassword"
                      labelText="Senha atual"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        required: true,
                        type: "password",
                        value: values.oldPassword,
                        onChange: (event) =>
                          handleSetValue("oldPassword", event.target.value),
                      }}
                    />
                    <span style={{ fontSize: 12, color: "red" }}>
                      {!!errors?.oldPassword &&
                        errorsMessage[errors.oldPassword]}
                    </span>

                    <GridContainer>
                      <GridItem xs={12} sm={6} md={6}>
                        <CustomInput
                          id="newPassword"
                          labelText="Nova senha"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            required: true,
                            type: "password",
                            value: values.newPassword,
                            onChange: (event) =>
                              handleSetValue("newPassword", event.target.value),
                          }}
                        />
                        <span style={{ fontSize: 12, color: "red" }}>
                          {!!errors?.newPassword &&
                            errorsMessage[errors.newPassword]}
                        </span>
                      </GridItem>
                      <GridItem xs={12} sm={6} md={6}>
                        <CustomInput
                          id="newPasswordRepet"
                          labelText="Repetir nova senha"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            required: true,
                            type: "password",
                            value: values.newPasswordRepet,
                            onChange: (event) =>
                              handleSetValue(
                                "newPasswordRepet",
                                event.target.value
                              ),
                          }}
                        />
                        <span style={{ fontSize: 12, color: "red" }}>
                          {!!errors?.newPasswordRepet &&
                            errorsMessage[errors.newPasswordRepet]}
                        </span>
                      </GridItem>
                      <span style={{ fontSize: 12, color: "red" }}>
                        {!!errors?.password && errors.password}
                      </span>
                      <Button color="info" onClick={handleSubmit}>
                        Salvar
                      </Button>
                    </GridContainer>
                  </GridItem>
                </GridContainer>
              </div>
            ),
          },
        ]}
      />

      <Modal
        type="success"
        onCancel={handleChangeIsOpen}
        onConfirm={handleChangeIsOpen}
        title="Confirmação"
        show={isOpen}
      >
        Sua senha foi alterada com sucesso!
      </Modal>

      <Modal
        type="error"
        onCancel={handleChangeIsOpenError}
        onConfirm={handleChangeIsOpenError}
        title="Confirmação"
        show={isOpenError}
      >
        Parece que sua senha atual esta errada.
      </Modal>
    </div>
  );
}
