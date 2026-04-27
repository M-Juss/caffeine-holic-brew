import { authFetch } from "@/lib/api";
import type {
  FavoriteMenuSize,
  FavoriteMenu,
  FavoriteItem,
  FavoriteListResponse,
  ToggleFavoritePayload,
  ToggleFavoriteResponse,
} from "@/types/app.types";

export {
  FavoriteMenuSize,
  FavoriteMenu,
  FavoriteItem,
  FavoriteListResponse,
  ToggleFavoritePayload,
  ToggleFavoriteResponse,
};

export async function getFavorites(): Promise<FavoriteListResponse> {
  return authFetch<FavoriteListResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/favorites`,
    {
      method: "GET",
    },
  );
}

export async function toggleFavorite(
  payload: ToggleFavoritePayload,
): Promise<ToggleFavoriteResponse> {
  return authFetch<ToggleFavoriteResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/favorites/toggle`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
