import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardFooter from "../../components/Card/CardFooter";
import CardHeader from "../../components/Card/CardHeader";
import RegularButton from "../../components/CustomButtons/Button";
import { Helmet } from "../../components/Helmet";
import CustomInput from "../../components/CustomInput/CustomInput";
import { Loading } from "../../components/Loading";

import { useAuthContext } from "../../context/Auth";
import { useAsync } from "../../hooks/useAsync";
import { useForm } from "../../hooks/useForm";
import { userResource } from "../../services/users";

import logo from "../../assets/img/logo.png";
import { maskTextCellPhone } from "../../hooks/maskText";

const initialValues = {
  username: "",
  password: "",
};

export function Login() {
  const inputRef = useRef();

  const { handleSetTokenAndUser } = useAuthContext();

  const { execute, value, status, error } = useAsync(userResource.auth);

  const [fields, setField, setAllFields, validateAllFields] = useForm({
    initialValues,
    requireds: ["username", "password"],
  });

  const history = useHistory();

  useEffect(() => {
    if (value) {
      handleSetTokenAndUser(value);

      history.push("/dashboard");
    }
  }, [value]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = {
      username: fields.username.replace(/[^\d]/g, ""),
      password: fields.password,
    };

    execute(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      {status === "pending" && <Loading message="Validando seus dados..." />}
      <Helmet title="Login" />
      <Card>
        <CardHeader
          color="info"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={logo} width="80px" height="80px" />
          <h4>Meu Petrecho - Login</h4>
        </CardHeader>
        <CardBody>
          <CustomInput
            id="username"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "text",
              placeholder: "Digite seu usuário",
              value: fields.username,
              onChange: (event) =>
                setField("username", maskTextCellPhone(event.target.value)),
            }}
          />
          <CustomInput
            id="password"
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              type: "password",
              placeholder: "Digite sua senha",
              value: fields.password,
              onChange: (event) => setField("password", event.target.value),
              ref: inputRef,
            }}
          />

          <RegularButton color="info" type="submit">
            Entrar
          </RegularButton>
        </CardBody>
        <CardFooter
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {error && (
            <p style={{ color: "red", width: 400, textAlign: "center" }}>
              Desculpe, mas as informações de login que você inseriu estão
              incorretas. Por favor, verifique o nome de usuário e senha e tente
              novamente.
            </p>
          )}
        </CardFooter>
      </Card>
    </form>
  );
}
