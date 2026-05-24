import { redirect } from "next/navigation";

export default function AdminDashboardIndex() {
  redirect("/dashboard/admin/agendamentos");
}
