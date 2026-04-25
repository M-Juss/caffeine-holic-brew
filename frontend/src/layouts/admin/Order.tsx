import { useEffect, useMemo, useState } from "react";
import OrderBadge from "@/components/common/OrderBadge";
import { Button } from "@/components/ui/button";
import { getOrders, type OrderData, type OrderStatus, updateOrderStatus } from "@/services/order.api";
import { toast } from "sonner";

type DisplayStatus = "Pending" | "Accepted" | "Preparing" | "Completed" | "Cancelled";
type StatusFilter = "All" | DisplayStatus;

const statusOptions: StatusFilter[] = [
  "All",
  "Pending",
  "Accepted",
  "Preparing",
  "Completed",
  "Cancelled",
];

const statusLabelMap: Record<OrderStatus, DisplayStatus> = {
  pending: "Pending",
  accepted: "Accepted",
  preparing: "Preparing",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusApiMap: Record<Exclude<StatusFilter, "All">, OrderStatus> = {
  Pending: "pending",
  Accepted: "accepted",
  Preparing: "preparing",
  Completed: "completed",
  Cancelled: "cancelled",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    const loadOrders = async () => {
      await Promise.resolve();
      if (isCancelled) return;

      setIsLoading(true);
      setError(null);

      try {
        const status = filter === "All" ? undefined : statusApiMap[filter];
        const response = await getOrders(status, currentPage);
        if (isCancelled) return;

        setOrders(response.data.data);
        setLastPage(response.data.last_page);
      } catch (err) {
        if (isCancelled) return;
        const message = err instanceof Error ? err.message : "Failed to load orders.";
        setError(message);
        toast.error(message);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      isCancelled = true;
    };
  }, [filter, currentPage, refreshKey]);

  const selectedOrder = useMemo(
    () => (selectedOrderId ? orders.find((order) => order.id === selectedOrderId) ?? null : null),
    [selectedOrderId, orders]
  );

  const handleUpdateStatus = async (
    orderId: number,
    status: "accepted" | "preparing" | "completed",
    successMessage: string
  ) => {
    setUpdatingOrderId(orderId);

    try {
      const response = await updateOrderStatus(orderId, { status });
      const updatedOrder = response.data;

      setOrders((prev) => prev.map((order) => (order.id === orderId ? updatedOrder : order)));
      toast.success(successMessage);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update order status.";
      toast.error(message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl text-[#5C5C5C] mb-6">Orders Management</h1>

      {!selectedOrderId ? (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setCurrentPage(1);
                  setSelectedOrderId(null);
                }}
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

          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-md p-6 text-[#A8A8A8]">Loading orders...</div>
          ) : error ? (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => setRefreshKey((prev) => prev + 1)}
                className="bg-[#D4A156] hover:bg-[#C59145] text-white"
              >
                Retry
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-6 text-[#A8A8A8]">No orders found.</div>
          ) : (
            <>
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
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-[#E0E0E0]">
                        <td className="py-4 px-6 text-[#5C5C5C]">{order.order_number}</td>
                        <td className="py-4 px-6 text-[#5C5C5C]">
                          {order.user?.username || `User #${order.user_id}`}
                        </td>
                        <td className="py-4 px-6 text-[#A8A8A8] text-sm">{formatDate(order.created_at)}</td>
                        <td className="py-4 px-6 text-[#D4A156]">${Number(order.total_amount).toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <OrderBadge status={statusLabelMap[order.status]} />
                        </td>
                        <td className="py-4 px-6">
                          <Button
                            onClick={() => setSelectedOrderId(order.id)}
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

              <div className="flex items-center justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <p className="text-sm text-[#5C5C5C]">
                  Page {currentPage} of {lastPage}
                </p>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
                  disabled={currentPage >= lastPage}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </>
      ) : selectedOrder ? (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <button
            onClick={() => setSelectedOrderId(null)}
            className="text-[#D4A156] mb-4 hover:underline"
          >
            ← Back to Orders
          </button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl text-[#5C5C5C]">{selectedOrder.order_number}</h2>
              <OrderBadge status={statusLabelMap[selectedOrder.status]} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-[#A8A8A8]">Customer</p>
              <p className="text-[#5C5C5C]">{selectedOrder.user?.username || `User #${selectedOrder.user_id}`}</p>
            </div>
            <div>
              <p className="text-sm text-[#A8A8A8]">Date</p>
              <p className="text-[#5C5C5C]">{formatDate(selectedOrder.created_at)}</p>
            </div>
          </div>

          {selectedOrder.customer_remarks && (
            <div className="mb-6 p-4 bg-[#F5F5F5] rounded-xl">
              <p className="text-sm text-[#A8A8A8] mb-1">Customer Remarks</p>
              <p className="text-[#5C5C5C]">{selectedOrder.customer_remarks}</p>
            </div>
          )}

          {(selectedOrder.reviewer_remarks || selectedOrder.reviwer_remarks) && (
            <div className="mb-6 p-4 bg-[#F5F5F5] rounded-xl">
              <p className="text-sm text-[#A8A8A8] mb-1">Admin Remarks</p>
              <p className="text-[#5C5C5C]">
                {selectedOrder.reviewer_remarks || selectedOrder.reviwer_remarks}
              </p>
            </div>
          )}

          <div className="border-t border-[#E0E0E0] pt-4 mb-6">
            <h3 className="text-lg text-[#5C5C5C] mb-4">Order Items</h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-[#5C5C5C]">{item.name}</p>
                    <p className="text-sm text-[#A8A8A8]">
                      {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-[#D4A156]">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E0E0E0] mt-4 pt-4 flex justify-between">
              <span className="text-lg text-[#5C5C5C]">Total</span>
              <span className="text-xl text-[#D4A156]">${Number(selectedOrder.total_amount).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {selectedOrder.status === "pending" && (
              <Button
                onClick={() => void handleUpdateStatus(selectedOrder.id, "accepted", "Order accepted")}
                disabled={updatingOrderId === selectedOrder.id}
                className="bg-[#D4A156] hover:bg-[#C59145] text-white"
              >
                Accept Order
              </Button>
            )}

            {selectedOrder.status === "accepted" && (
              <Button
                onClick={() =>
                  void handleUpdateStatus(selectedOrder.id, "preparing", "Order moved to preparing")
                }
                disabled={updatingOrderId === selectedOrder.id}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Preparing
              </Button>
            )}

            {selectedOrder.status === "preparing" && (
              <Button
                onClick={() =>
                  void handleUpdateStatus(selectedOrder.id, "completed", "Order marked as completed")
                }
                disabled={updatingOrderId === selectedOrder.id}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Mark as Completed
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-[#A8A8A8] mb-4">This order is no longer in the current page/filter.</p>
          <Button onClick={() => setSelectedOrderId(null)} variant="outline">
            Back to list
          </Button>
        </div>
      )}
    </div>
  );
}
