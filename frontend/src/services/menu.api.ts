import { authFetch } from "@/lib/api";

export type MenuCategory = "Coffee" | "Non Coffee" | "Pastries" | "Snacks";

export type MenuResponse = {
  message: string;
  data: {
    id: number;
    image_path: string;
    name: string;
    description: string;
    category: MenuCategory;
    is_available: boolean;
    sizes: Array<{
      size: string;
      price: number;
    }>;
  };
};

export type MenuListResponse = {
  message: string;
  data: MenuResponse["data"][];
};

export type CreateMenuPayload = {
  image: File;
  name: string;
  description: string;
  category: MenuCategory;
  is_available: boolean;
  sizes: Array<{
    name: string;
    price: number;
  }>;
};

export type UpdateMenuPayload = {
  image?: File;
  name?: string;
  description?: string;
  category?: MenuCategory;
  is_available?: boolean;
  sizes?: Array<{
    menu: string;
    price: number;
  }>;
};

export async function createMenu(payload: CreateMenuPayload): Promise<MenuResponse> {
  const formData = new FormData();

  formData.append("image", payload.image);
  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("category", payload.category);
  formData.append("is_available", payload.is_available ? "1" : "0");

  payload.sizes.forEach((size, index) => {
    formData.append(`sizes[${index}][name]`, size.name);
    formData.append(`sizes[${index}][price]`, String(size.price));
  });

  return authFetch<MenuResponse>(`${process.env.NEXT_PUBLIC_API_URL}/menu`, {
    method: "POST",
    body: formData,
  });
}

export async function getMenus(): Promise<MenuListResponse> {
  return authFetch<MenuListResponse>(`${process.env.NEXT_PUBLIC_API_URL}/menu`, {
    method: "GET",
  });
}

export async function updateMenu(
  id: number,
  payload: UpdateMenuPayload
): Promise<MenuResponse> {
  const formData = new FormData();
  formData.append("_method", "PATCH");

  if (payload.image) formData.append("image", payload.image);
  if (payload.name !== undefined) formData.append("name", payload.name);
  if (payload.description !== undefined) {
    formData.append("description", payload.description);
  }
  if (payload.category !== undefined) formData.append("category", payload.category);
  if (payload.is_available !== undefined) {
    formData.append("is_available", payload.is_available ? "1" : "0");
  }

  payload.sizes?.forEach((size, index) => {
    formData.append(`sizes[${index}][menu]`, size.menu);
    formData.append(`sizes[${index}][price]`, String(size.price));
  });

  return authFetch<MenuResponse>(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}`, {
    method: "POST",
    body: formData,
  });
}

export async function deleteMenu(id: number): Promise<{ message: string }> {
  return authFetch<{ message: string }>(
    `${process.env.NEXT_PUBLIC_API_URL}/menu/${id}`,
    {
      method: "DELETE",
    }
  );
}
