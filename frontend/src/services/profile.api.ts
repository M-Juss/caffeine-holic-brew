
import { authFetch } from "@/lib/api";

export type ProfileResponse = {
  message: string;
  data: {
    user: {
      id: number;
      username: string;
      email: string;
      role: string;
      created_at: string;
    };
    stats: {
      member_since: string;
      total_spent: number;
      total_orders: number;
    };
  };
};

export type ChangePasswordPayload = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

export async function getProfile(): Promise<ProfileResponse> {
  return authFetch<ProfileResponse>(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
    method: "GET",
  });
}

export async function changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
  return authFetch<{ message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/profile/password`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
