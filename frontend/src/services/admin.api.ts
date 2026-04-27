import { authFetch } from "@/lib/api";
import type {
  Admin,
  CreateAdminResponse,
  GetAdminsResponse,
  UpdateAdminResponse,
  DeleteAdminResponse,
} from "@/types/app.types";
import type { CreateAdminInput } from "@/validations/user.validation";

export {
  Admin,
  CreateAdminResponse,
  GetAdminsResponse,
  UpdateAdminResponse,
  DeleteAdminResponse,
};

export async function getAdmins(): Promise<GetAdminsResponse> {
  return authFetch<GetAdminsResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/users?role=admin`,
    {
      method: "GET",
    },
  );
}

export async function createAdmin(
  data: CreateAdminInput,
): Promise<CreateAdminResponse> {
  return authFetch<CreateAdminResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/users`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function updateAdmin(
  id: number,
  data: Partial<Admin>,
): Promise<UpdateAdminResponse> {
  return authFetch<UpdateAdminResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

export async function deleteAdmin(id: number): Promise<DeleteAdminResponse> {
  return authFetch<DeleteAdminResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      method: "DELETE",
    },
  );
}
