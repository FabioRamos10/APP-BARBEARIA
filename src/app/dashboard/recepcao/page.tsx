import { redirect } from "next/navigation";

export default function RecepcaoDashboardIndex() {
  redirect("/dashboard/recepcao/agendamentos");
}
