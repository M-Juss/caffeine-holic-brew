import { authFetch } from "@/lib/api";
import type {
  Rider,
  CreateRiderResponse,
  GetRidersResponse,
  UpdateRiderResponse,
  DeleteRiderResponse,
} from "@/types/app.types";
import type { CreateRiderInput } from "@/validations/user.validation";

export {
  Rider,
  CreateRiderResponse,
  GetRidersResponse,
  UpdateRiderResponse,
  DeleteRiderResponse,
};

export async function getRiders(): Promise<GetRidersResponse> {
  return authFetch<GetRidersResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/riders`,
    {
      method: "GET",
    },
  );
}

export async function getActiveRiders(): Promise<GetRidersResponse> {
  return authFetch<GetRidersResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/riders?status=active`,
    {
      method: "GET",
    },
  );
}

export async function createRider(
  data: CreateRiderInput,
): Promise<CreateRiderResponse> {
  return authFetch<CreateRiderResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/users`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function updateRider(
  id: number,
  data: Partial<Rider>,
): Promise<UpdateRiderResponse> {
  return authFetch<UpdateRiderResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

export async function deleteRider(id: number): Promise<DeleteRiderResponse> {
  return authFetch<DeleteRiderResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      method: "DELETE",
    },
  );
}
