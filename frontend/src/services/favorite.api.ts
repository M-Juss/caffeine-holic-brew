import { authFetch } from "@/lib/api";

export type FavoriteMenuSize = {
  id: number;
  menu_id: number;
  size: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export type FavoriteMenu = {
  id: number;
  image_path: string;
  name: string;
  description: string;
  is_available: boolean;
  category: "Coffee" | "Non Coffee" | "Pastries" | "Snacks";
  created_at: string;
  updated_at: string;
  sizes: FavoriteMenuSize[];
};

export type FavoriteItem = {
  id: number;
  user_id: number;
  menu_id: number;
  created_at: string;
  updated_at: string;
  menu: FavoriteMenu;
};

export type FavoriteListResponse = {
  message: string;
  data: FavoriteItem[];
};

export type ToggleFavoritePayload = {
  menu_id: number;
};

export type ToggleFavoriteResponse = {
  message: string;
  is_favorited: boolean;
};

export async function getFavorites(): Promise<FavoriteListResponse> {
  return authFetch<FavoriteListResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/favorites`,
    {
      method: "GET",
    }
  );
}

export async function toggleFavorite(
  payload: ToggleFavoritePayload
): Promise<ToggleFavoriteResponse> {
  return authFetch<ToggleFavoriteResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/favorites/toggle`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}
