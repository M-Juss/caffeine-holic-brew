import { authFetch } from "@/lib/api";

export type CreateMenuPayload = {
  image: File;
  name: string;
  description: string;
  category: "Coffee" | "Non Coffee" | "Pastries" | "Snacks";
  is_available: boolean;
  sizes: Array<{
    name: string;
    price: number;
  }>;
};

type CreateMenuResponse = {
  message: string;
  data: {
    image_path: string;
    name: string;
    description: string;
    is_available: boolean;
    sizes: Array<{
      size: string;
      price: number;
    }>;
  };
};

export async function createMenu(
  payload: CreateMenuPayload
): Promise<CreateMenuResponse> {
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

  return authFetch<CreateMenuResponse>(`${process.env.NEXT_PUBLIC_API_URL}/menu`, {
    method: "POST",
    body: formData,
  });
}
