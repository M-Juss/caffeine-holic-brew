import { authFetch } from "@/lib/api";

export type OrderStatus = "pending" | "accepted" | "preparing" | "completed" | "cancelled";
export type OrderStatusUpdatable = "pending" | "accepted" | "preparing" | "completed";

export type OrderUser = {
  id: number;
  username: string;
  email?: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  menu_id: number | null;
  image_path: string;
  name: string;
  description: string;
  size: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type OrderData = {
  id: number;
  user_id: number;
  order_number: string;
  total_amount: number;
  discount_amount: number;
  total_items: number;
  customer_remarks: string | null;
  status: OrderStatus;
  reviewed_by: number | null;
  reviewed_at: string | null;
  reviewer_remarks?: string | null;
  reviwer_remarks?: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  user?: OrderUser;
};

type PaginatedResponse<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
};

type OrdersApiResponse = {
  message: string;
  data: PaginatedResponse<OrderData>;
};

type OrderApiResponse = {
  message: string;
  data: OrderData;
};

export async function getOrders(status?: OrderStatus, page?: number): Promise<OrdersApiResponse> {
  return authFetch<OrdersApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
    method: "GET",
    params: { status, page },
  });
}

export async function getMyOrders(status?: OrderStatus, page?: number): Promise<OrdersApiResponse> {
  return authFetch<OrdersApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`, {
    method: "GET",
    params: { status, page },
  });
}

export async function getOrder(orderId: number): Promise<OrderApiResponse> {
  return authFetch<OrderApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
    method: "GET",
  });
}

export async function updateOrderStatus(
  orderId: number,
  payload: { status: OrderStatusUpdatable; reviewer_remarks?: string }
): Promise<OrderApiResponse> {
  return authFetch<OrderApiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

export async function cancelOrder(orderId: number): Promise<OrderApiResponse> {
  return authFetch<OrderApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`, {
    method: "PATCH",
  });
}
