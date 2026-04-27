import { authFetch } from "@/lib/api";
import type { OrderData } from "./order.api";

export async function getDashboardData() {
  return authFetch<{
    message: string;
    data: {
      total_sales: number;
      total_orders: number;
      most_popular_item: { name: string; total_ordered: number } | null;
      recent_orders: OrderData[];
    };
  }>(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
    method: "GET",
  });
}
