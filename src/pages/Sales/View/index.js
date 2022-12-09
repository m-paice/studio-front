import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useAsync } from "../../../hooks/useAsync";
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
      <div>
        <b> Nome do cliente: </b> <span> {value?.user.name} </span>
      </div>

      <div>
        <b> Produtos </b>
        {value?.products.map((item) => (
          <div key={item.id}>
            <b> Nome: </b>
            <span> {item.name} </span>
            <b> Quantidade: </b> <span> {item.amount} </span>
            <b> Preço: </b> <span> {formatPrice(item.price || 0)} </span>
            <b>Desconto: </b>{" "}
            <span> {formatPrice(item.ProductSale.discount)} </span>
            <b>Adicional: </b>{" "}
            <span> {formatPrice(item.ProductSale.addition)} </span>
          </div>
        ))}
      </div>

      <div>
        <b> Pagamento: </b>
        <span>
          {" "}
          {value?.payment.formOfPayment == 1 ? "Dinheiro" : "Cartão"}{" "}
        </span>
        <b>Parcelado:</b> <span>{value?.payment.amountParcel} </span>
      </div>

      <div>
        <b> Data da venda: </b> <span> {formatDate(value?.createdAt)} </span>
      </div>
    </div>
  );
}
