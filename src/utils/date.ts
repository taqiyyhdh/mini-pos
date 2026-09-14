import type { Timestamp } from "firebase/firestore";

export function formatDate(value?: Timestamp) {
  if(!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value.toDate());
}