import { useEffect, useState } from "react";
import {  PhilippinePeso, ShoppingBag, TrendingUp } from "lucide-react";
import { getDashboardData } from "@/services/dashboard.api";
import { toast } from "sonner";

interface RecentOrder {
  order: string;
  customer: string;
  total: number;
  status: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState([
    {
      label: "Total Sales",
      value: "₱ 0.00",
      icon: PhilippinePeso,
      color: "bg-[#D4A156]",
    },
    {
      label: "Total Orders",
      value: "0",
      icon: ShoppingBag,
      color: "bg-[#5C5C5C]",
    },
    {
      label: "Popular Item",
      value: "N/A",
      icon: TrendingUp,
      color: "bg-[#A8A8A8]",
    },
  ]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await getDashboardData();
        const data = response.data;

        setStats([
          {
            label: "Total Sales",
            value: `₱${data.total_sales.toFixed(2)}`,
            icon: PhilippinePeso,
            color: "bg-[#D4A156]",
          },
          {
            label: "Total Orders",
            value: data.total_orders.toString(),
            icon: ShoppingBag,
            color: "bg-[#5C5C5C]",
          },
          {
            label: "Popular Item",
            value: data.most_popular_item?.name || "N/A",
            icon: TrendingUp,
            color: "bg-[#A8A8A8]",
          },
        ]);

        setRecentOrders(
          data.recent_orders.map((order) => ({
            order: order.order_number,
            customer: order.user?.username || "Unknown",
            total: order.total_amount,
            status:
              order.status.charAt(0).toUpperCase() + order.status.slice(1),
          })),
        );
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load dashboard data";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboardData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl text-[#5C5C5C] mb-6">Dashboard</h1>

      {isLoading ? (
        <div className="bg-white rounded-2xl p-8 shadow-md text-[#A8A8A8]">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-6 shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-[#A8A8A8] text-sm mb-1">{stat.label}</p>
                <p className="text-2xl text-[#5C5C5C]">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-xl text-[#5C5C5C] mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E0E0E0]">
                    <th className="text-left py-3 px-4 text-[#5C5C5C]">
                      Order
                    </th>
                    <th className="text-left py-3 px-4 text-[#5C5C5C]">
                      Customer
                    </th>
                    <th className="text-left py-3 px-4 text-[#5C5C5C]">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 text-[#5C5C5C]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.order} className="border-b border-[#E0E0E0]">
                      <td className="py-3 px-4 text-[#5C5C5C]">
                        {order.order}
                      </td>
                      <td className="py-3 px-4 text-[#5C5C5C]">
                        {order.customer}
                      </td>
                      <td className="py-3 px-4 text-[#D4A156]">
                        ₱{order.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Preparing"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
