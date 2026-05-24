import { redirect } from "next/navigation";

export default function ClienteDashboardIndex() {
  redirect("/dashboard/cliente/agendamentos");
}
