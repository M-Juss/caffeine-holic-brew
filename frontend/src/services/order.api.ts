import { authFetch } from "@/lib/api";
import type {
  OrderStatus,
  OrderStatusUpdatable,
  OrderUser,
  OrderItem,
  OrderData,
  PaginatedResponse,
  OrdersApiResponse,
  OrderApiResponse,
} from "@/types/app.types";

export {
  OrderStatus,
  OrderStatusUpdatable,
  OrderUser,
  OrderItem,
  OrderData,
  PaginatedResponse,
  OrdersApiResponse,
  OrderApiResponse,
};

export async function getOrders(
  status?: OrderStatus,
  page?: number,
): Promise<OrdersApiResponse> {
  return authFetch<OrdersApiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/orders`,
    {
      method: "GET",
      params: { status, page },
    },
  );
}

export async function getMyOrders(
  status?: OrderStatus,
  page?: number,
): Promise<OrdersApiResponse> {
  return authFetch<OrdersApiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`,
    {
      method: "GET",
      params: { status, page },
    },
  );
}

export async function getOrder(orderId: number): Promise<OrderApiResponse> {
  return authFetch<OrderApiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
    {
      method: "GET",
    },
  );
}

export async function updateOrderStatus(
  orderId: number,
  payload: { status: OrderStatusUpdatable; reviewer_remarks?: string },
): Promise<OrderApiResponse> {
  return authFetch<OrderApiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export async function cancelOrder(orderId: number): Promise<OrderApiResponse> {
  return authFetch<OrderApiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`,
    {
      method: "PATCH",
    },
  );
}

export async function assignRider(
  orderId: number,
  riderId: number,
): Promise<OrderApiResponse> {
  return authFetch<OrderApiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/assign-rider`,
    {
      method: "PATCH",
      body: JSON.stringify({ assigned_rider: riderId }),
    },
  );
}
