import React, { useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";

import { useAsync } from "../../../hooks/useAsync";
import { Skeleton } from "../../../components/Skeleton";
import Button from "../../../components/CustomButtons/Button";
import { salesResource } from "../../../services/sales";
import { formatDate } from "../../../utils/formatDate";
import { formatPrice } from "../../../utils/formatPrice";

export function SalesView() {
  const { id } = useParams();

  const { execute: findById, value } = useAsync(salesResource.findById);

  useEffect(() => {
    if (id) findById(id);
  }, []);

  return (
    <div>
      {!value ? (
        <Skeleton />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <b> Nome do cliente: </b> <span> {value?.user.name} </span>
          </div>

          <NavLink to="/sales">
            <Button color="info">Voltar</Button>
          </NavLink>
        </div>
      )}

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        {!value ? (
          <Skeleton lines={4} />
        ) : (
          <>
            <b> Produtos </b>
            {value?.products.map((item) => (
              <div key={item.id}>
                <b> Nome: </b>
                <span> {item.name} </span>
                <b> Quantidade: </b> <span> {item.amount} </span>
                <b> Preço: </b> <span> {formatPrice(item.price)} </span>
                <b>Desconto: </b>{" "}
                <span> {formatPrice(item.ProductSale.discount)} </span>
                <b>Adicional: </b>{" "}
                <span> {formatPrice(item.ProductSale.addition)} </span>
              </div>
            ))}
          </>
        )}
      </div>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        {!value ? (
          <Skeleton lines={2} />
        ) : (
          <div>
            <div>
              <b>TOTAL:</b> <span>{formatPrice(value?.total)} </span>
            </div>
            <b> Pagamento: </b>
            <span>
              {" "}
              {value?.payment.formOfPayment == 1 ? "Dinheiro" : "Cartão"}{" "}
            </span>
            <b>Parcelado:</b> <span>{value?.payment.amountParcel}x </span>
          </div>
        )}
      </div>

      {!value ? (
        <Skeleton />
      ) : (
        <div>
          <b> Data da venda: </b> <span> {formatDate(value?.createdAt)} </span>
        </div>
      )}
    </div>
  );
}
