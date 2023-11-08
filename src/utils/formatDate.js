import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(date, formatDefault = "dd/MM/yyyy") {
  if (!date) return;

  return format(new Date(date), formatDefault, { locale: ptBR });
}
