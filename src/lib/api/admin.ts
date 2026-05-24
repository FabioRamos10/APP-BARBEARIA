import { apiFetch } from "@/lib/api/client";
import type {
  StaffUserCreateDTO,
  StaffUserResponseDTO,
  StaffUserStatusDTO,
  StaffUserSummaryDTO,
} from "@/lib/types/dto";

export function listStaffUsers() {
  return apiFetch<StaffUserSummaryDTO[]>("/admin/usuarios");
}

export function createStaffUser(dto: StaffUserCreateDTO) {
  return apiFetch<StaffUserResponseDTO>("/admin/usuarios", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function updateStaffUserStatus(userId: string, dto: StaffUserStatusDTO) {
  return apiFetch<StaffUserSummaryDTO>(`/admin/usuarios/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify(dto),
  });
}
