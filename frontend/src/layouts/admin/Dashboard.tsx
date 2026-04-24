import { DollarSign, ShoppingBag, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "Total Sales", value: "$12,450", icon: DollarSign, color: "bg-[#D4A156]" },
    { label: "Total Orders", value: "342", icon: ShoppingBag, color: "bg-[#5C5C5C]" },
    { label: "Popular Item", value: "Cappuccino", icon: TrendingUp, color: "bg-[#A8A8A8]" },
  ];

  const recentOrders = [
    { order: "ORD-042", customer: "Alice Smith", total: 12.5, status: "Completed" },
    { order: "ORD-043", customer: "Bob Johnson", total: 8.8, status: "Preparing" },
    { order: "ORD-044", customer: "Carol White", total: 15.2, status: "Pending" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl text-[#5C5C5C] mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
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
                <th className="text-left py-3 px-4 text-[#5C5C5C]">Order</th>
                <th className="text-left py-3 px-4 text-[#5C5C5C]">Customer</th>
                <th className="text-left py-3 px-4 text-[#5C5C5C]">Total</th>
                <th className="text-left py-3 px-4 text-[#5C5C5C]">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.order} className="border-b border-[#E0E0E0]">
                  <td className="py-3 px-4 text-[#5C5C5C]">{order.order}</td>
                  <td className="py-3 px-4 text-[#5C5C5C]">{order.customer}</td>
                  <td className="py-3 px-4 text-[#D4A156]">${order.total.toFixed(2)}</td>
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
    </div>
  );
}
