import { format } from "date-fns";

export function formatDate(date) {
  if (!date) return;

  return format(new Date(date), "dd/MM/yyyy");
}
