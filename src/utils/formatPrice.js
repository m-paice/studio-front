export function formatPrice(value = 0) {
  if (!value) return 0;

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
