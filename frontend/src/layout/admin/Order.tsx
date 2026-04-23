import { useState } from "react";
import OrderBadge from "@/components/common/OrderBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const mockOrders = [
  {
    id: 1,
    orderNumber: "ORD-001",
    customer: "Alice Smith",
    date: "2026-04-23 09:30",
    total: 12.5,
    status: "Completed" as const,
    items: [
      { name: "Espresso", size: "Medium", quantity: 2, price: 3.5 },
      { name: "Cappuccino", size: "Large", quantity: 1, price: 5.5 },
    ],
    remarks: "Extra hot please",
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    customer: "Bob Johnson",
    date: "2026-04-23 10:15",
    total: 8.8,
    status: "Preparing" as const,
    items: [
      { name: "Latte", size: "Medium", quantity: 1, price: 4.8 },
      { name: "Americano", size: "Small", quantity: 1, price: 2.8 },
    ],
    remarks: "",
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    customer: "Carol White",
    date: "2026-04-23 11:00",
    total: 6.0,
    status: "Pending" as const,
    items: [{ name: "Mocha", size: "Large", quantity: 1, price: 6.0 }],
    remarks: "Less sugar",
  },
];

export default function OrdersManagement() {
  const [orders, setOrders] = useState(mockOrders);
  const [filter, setFilter] = useState<"All" | "Pending" | "Preparing" | "Completed">("All");
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const filteredOrders =
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const order = selectedOrder ? orders.find((o) => o.id === selectedOrder) : null;

  const updateOrderStatus = (orderId: number, newStatus: "Pending" | "Preparing" | "Completed") => {
    setOrders(
      orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    toast.success(`Order status updated to ${newStatus}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl text-[#5C5C5C] mb-6">Orders Management</h1>

      {!selectedOrder ? (
        <>
          <div className="flex gap-2 mb-6">
            {["All", "Pending", "Preparing", "Completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  filter === status
                    ? "bg-[#D4A156] text-white"
                    : "bg-white text-[#5C5C5C] hover:bg-[#F5F5F5]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th className="text-left py-4 px-6 text-[#5C5C5C]">Order Number</th>
                  <th className="text-left py-4 px-6 text-[#5C5C5C]">Customer</th>
                  <th className="text-left py-4 px-6 text-[#5C5C5C]">Date</th>
                  <th className="text-left py-4 px-6 text-[#5C5C5C]">Total</th>
                  <th className="text-left py-4 px-6 text-[#5C5C5C]">Status</th>
                  <th className="text-left py-4 px-6 text-[#5C5C5C]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#E0E0E0]">
                    <td className="py-4 px-6 text-[#5C5C5C]">{order.orderNumber}</td>
                    <td className="py-4 px-6 text-[#5C5C5C]">{order.customer}</td>
                    <td className="py-4 px-6 text-[#A8A8A8] text-sm">{order.date}</td>
                    <td className="py-4 px-6 text-[#D4A156]">${order.total.toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <OrderBadge status={order.status} />
                    </td>
                    <td className="py-4 px-6">
                      <Button
                        onClick={() => setSelectedOrder(order.id)}
                        variant="outline"
                        className="text-[#D4A156] border-[#D4A156] hover:bg-[#D4A156] hover:text-white"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-[#D4A156] mb-4 hover:underline"
          >
            ← Back to Orders
          </button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl text-[#5C5C5C]">{order?.orderNumber}</h2>
              <OrderBadge status={order?.status || "Pending"} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-[#A8A8A8]">Customer</p>
              <p className="text-[#5C5C5C]">{order?.customer}</p>
            </div>
            <div>
              <p className="text-sm text-[#A8A8A8]">Date</p>
              <p className="text-[#5C5C5C]">{order?.date}</p>
            </div>
          </div>

          {order?.remarks && (
            <div className="mb-6 p-4 bg-[#F5F5F5] rounded-xl">
              <p className="text-sm text-[#A8A8A8] mb-1">Customer Remarks</p>
              <p className="text-[#5C5C5C]">{order.remarks}</p>
            </div>
          )}

          <div className="border-t border-[#E0E0E0] pt-4 mb-6">
            <h3 className="text-lg text-[#5C5C5C] mb-4">Order Items</h3>
            <div className="space-y-3">
              {order?.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-[#5C5C5C]">{item.name}</p>
                    <p className="text-sm text-[#A8A8A8]">
                      {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-[#D4A156]">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E0E0E0] mt-4 pt-4 flex justify-between">
              <span className="text-lg text-[#5C5C5C]">Total</span>
              <span className="text-xl text-[#D4A156]">${order?.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            {order?.status === "Pending" && (
              <Button
                onClick={() => updateOrderStatus(order.id, "Preparing")}
                className="bg-[#D4A156] hover:bg-[#C59145] text-white"
              >
                Accept Order
              </Button>
            )}
            {order?.status === "Preparing" && (
              <Button
                onClick={() => updateOrderStatus(order.id, "Completed")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Mark as Completed
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
