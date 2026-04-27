import { authFetch } from "@/lib/api";
import type {
  ProfileResponse,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "@/types/app.types";

export { ProfileResponse, UpdateProfilePayload, ChangePasswordPayload };

export async function getProfile(): Promise<ProfileResponse> {
  return authFetch<ProfileResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/profile`,
    {
      method: "GET",
    },
  );
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<{ message: string }> {
  return authFetch<{ message: string }>(
    `${process.env.NEXT_PUBLIC_API_URL}/profile`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<{ message: string }> {
  return authFetch<{ message: string }>(
    `${process.env.NEXT_PUBLIC_API_URL}/profile/password`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}
