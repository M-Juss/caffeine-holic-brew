import { authFetch } from "@/lib/api";

export async function getDashboardStats() {
  return authFetch<{
    message: string;
    data: {
      total_sales: number;
      total_orders: number;
      popular_item: string;
    };
  }>(`${process.env.NEXT_PUBLIC_API_URL}/orders/dashboard-stats`, {
    method: "GET",
  });
}
