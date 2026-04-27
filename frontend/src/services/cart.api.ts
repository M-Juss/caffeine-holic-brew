import { authFetch } from "@/lib/api";
import type {
  CartItemResponse,
  CartResponseData,
  CartResponse,
  AddCartItemPayload,
  CheckoutPayload,
} from "@/types/app.types";

export {
  CartItemResponse,
  CartResponseData,
  CartResponse,
  AddCartItemPayload,
  CheckoutPayload,
};

export async function getCart(): Promise<CartResponse> {
  return authFetch<CartResponse>(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
    method: "GET",
  });
}

export async function addCartItem(
  payload: AddCartItemPayload,
): Promise<CartResponse> {
  return authFetch<CartResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/items`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function increaseCartItem(
  cartItemId: number,
): Promise<CartResponse> {
  return authFetch<CartResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/items/${cartItemId}/increase`,
    {
      method: "PATCH",
    },
  );
}

export async function decreaseCartItem(
  cartItemId: number,
): Promise<CartResponse> {
  return authFetch<CartResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/items/${cartItemId}/decrease`,
    {
      method: "PATCH",
    },
  );
}

export async function removeCartItem(
  cartItemId: number,
): Promise<CartResponse> {
  return authFetch<CartResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/items/${cartItemId}`,
    {
      method: "DELETE",
    },
  );
}

export async function clearCart(): Promise<{ message: string }> {
  return authFetch<{ message: string }>(
    `${process.env.NEXT_PUBLIC_API_URL}/cart`,
    {
      method: "DELETE",
    },
  );
}

export async function checkoutCart(payload: CheckoutPayload): Promise<{
  message: string;
  data: unknown;
}> {
  return authFetch<{ message: string; data: unknown }>(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/checkout`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
