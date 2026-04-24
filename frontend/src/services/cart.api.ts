import { authFetch } from "@/lib/api";

export type CartItemResponse = {
  id: number;
  cart_id: number;
  menu_id: number;
  image_path: string;
  name: string;
  description: string;
  size: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type CartResponseData = {
  id: number;
  user_id: string;
  total_amount: number;
  total_items: number;
  created_at: string;
  updated_at: string;
  items: CartItemResponse[];
};

export type CartResponse = {
  message: string;
  data: CartResponseData | null;
};

export type AddCartItemPayload = {
  menu_id: number;
  size: string;
  quantity: number;
};

export type CheckoutPayload = {
  customer_remarks?: string;
  discount_amount?: number;
};

export async function getCart(): Promise<CartResponse> {
  return authFetch<CartResponse>(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
    method: "GET",
  });
}

export async function addCartItem(payload: AddCartItemPayload): Promise<CartResponse> {
  return authFetch<CartResponse>(`${process.env.NEXT_PUBLIC_API_URL}/cart/items`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function increaseCartItem(cartItemId: number): Promise<CartResponse> {
  return authFetch<CartResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/items/${cartItemId}/increase`,
    {
      method: "PATCH",
    }
  );
}

export async function decreaseCartItem(cartItemId: number): Promise<CartResponse> {
  return authFetch<CartResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/items/${cartItemId}/decrease`,
    {
      method: "PATCH",
    }
  );
}

export async function removeCartItem(cartItemId: number): Promise<CartResponse> {
  return authFetch<CartResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/items/${cartItemId}`,
    {
      method: "DELETE",
    }
  );
}

export async function clearCart(): Promise<{ message: string }> {
  return authFetch<{ message: string }>(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
    method: "DELETE",
  });
}

export async function checkoutCart(payload: CheckoutPayload = {}): Promise<{
  message: string;
  data: unknown;
}> {
  return authFetch<{ message: string; data: unknown }>(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/checkout`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}
