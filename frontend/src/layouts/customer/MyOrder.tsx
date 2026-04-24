import { useState } from "react";
import OrderBadge from "@/components/common/OrderBadge";
import { ChevronRight } from "lucide-react";

const mockOrders = [
  {
    id: 1,
    orderNumber: "ORD-001",
    date: "2026-04-23 09:30",
    total: 12.5,
    status: "Completed" as const,
    items: [
      { name: "Espresso", size: "Medium", quantity: 2, price: 3.5 },
      { name: "Cappuccino", size: "Large", quantity: 1, price: 5.5 },
    ],
  },
  {
    id: 2,
    orderNumber: "ORD-002",
    date: "2026-04-23 10:15",
    total: 8.8,
    status: "Preparing" as const,
    items: [
      { name: "Latte", size: "Medium", quantity: 1, price: 4.8 },
      { name: "Americano", size: "Small", quantity: 1, price: 2.8 },
    ],
  },
  {
    id: 3,
    orderNumber: "ORD-003",
    date: "2026-04-23 11:00",
    total: 6.0,
    status: "Pending" as const,
    items: [{ name: "Mocha", size: "Large", quantity: 1, price: 6.0 }],
  },
];

export default function MyOrders() {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const order = selectedOrder ? mockOrders.find((o) => o.id === selectedOrder) : null;

  return (
    <div className="p-6">
      <h1 className="text-3xl text-[#5C5C5C] mb-6">My Orders</h1>

      {!selectedOrder ? (
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order.id)}
              className="w-full bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex items-center justify-between text-left"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-xl text-[#5C5C5C]">{order.orderNumber}</h3>
                  <OrderBadge status={order.status} />
                </div>
                <p className="text-sm text-[#A8A8A8]">{order.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-[#A8A8A8]">Total</p>
                  <p className="text-xl text-[#D4A156]">${order.total.toFixed(2)}</p>
                </div>
                <ChevronRight className="w-6 h-6 text-[#A8A8A8]" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-[#D4A156] mb-4 hover:underline"
          >
            ← Back to Orders
          </button>

          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl text-[#5C5C5C]">{order?.orderNumber}</h2>
            <OrderBadge status={order?.status || "Pending"} />
          </div>

          <div className="mb-6">
            <p className="text-[#A8A8A8]">{order?.date}</p>
          </div>

          <div className="border-t border-[#E0E0E0] pt-4">
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
        </div>
      )}
    </div>
  );
}
