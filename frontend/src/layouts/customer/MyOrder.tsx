import { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import OrderBadge from "@/components/common/OrderBadge";
import { Button } from "@/components/ui/button";
import {
  cancelOrder,
  getMyOrders,
  type OrderData,
  type OrderStatus,
} from "@/services/order.api";
import { toast } from "sonner";

import type { DisplayStatus, StatusFilter } from "@/types/app.types";

const statusOptions: StatusFilter[] = [
  "All",
  "Pending",
  "Accepted",
  "Preparing",
  "Out for Delivery",
  "Completed",
  "Cancelled",
];

const statusLabelMap: Record<OrderStatus, DisplayStatus> = {
  pending: "Pending",
  accepted: "Accepted",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusApiMap: Record<Exclude<StatusFilter, "All">, OrderStatus> = {
  Pending: "pending",
  Accepted: "accepted",
  Preparing: "preparing",
  "Out for Delivery": "out_for_delivery",
  Completed: "completed",
  Cancelled: "cancelled",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export default function MyOrders() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
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
        const response = await getMyOrders(status, currentPage);
        if (isCancelled) return;

        setOrders(response.data.data);
        setLastPage(response.data.last_page);
      } catch (err) {
        if (isCancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load your orders.";
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
    () =>
      selectedOrderId
        ? (orders.find((order) => order.id === selectedOrderId) ?? null)
        : null,
    [selectedOrderId, orders],
  );

  const handleCancelOrder = async (orderId: number) => {
    const confirmed = window.confirm(
      "Cancel this order? This can only be done while it is pending.",
    );
    if (!confirmed) return;

    setIsCancelling(true);

    try {
      const response = await cancelOrder(orderId);
      const updatedOrder = response.data;

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order)),
      );
      toast.success("Order cancelled successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to cancel order.";
      toast.error(message);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl text-[#5C5C5C] mb-6">My Orders</h1>

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
            <div className="bg-white rounded-2xl p-6 shadow-md text-[#A8A8A8]">
              Loading orders...
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => setRefreshKey((prev) => prev + 1)}
                className="bg-[#D4A156] hover:bg-[#C59145] text-white"
              >
                Retry
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-md text-[#A8A8A8]">
              No orders found.
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className="w-full bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex items-center justify-between text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2 flex-wrap">
                        <h3 className="text-xl text-[#5C5C5C]">
                          {order.order_number}
                        </h3>
                        <OrderBadge status={statusLabelMap[order.status]} />
                      </div>
                      <p className="text-sm text-[#A8A8A8]">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-[#A8A8A8]">Total</p>
                        <p className="text-xl text-[#D4A156]">
                          ₱{Number(order.total_amount).toFixed(2)}
                        </p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-[#A8A8A8]" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <p className="text-sm text-[#5C5C5C]">
                  Page {currentPage} of {lastPage}
                </p>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, lastPage))
                  }
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

          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <h2 className="text-2xl text-[#5C5C5C]">
              {selectedOrder.order_number}
            </h2>
            <OrderBadge status={statusLabelMap[selectedOrder.status]} />
          </div>

          <div className="mb-6">
            <p className="text-[#A8A8A8]">
              {formatDate(selectedOrder.created_at)}
            </p>
          </div>

          <div className="mb-6 p-4 bg-[#F5F5F5] rounded-xl">
            <h3 className="text-lg text-[#5C5C5C] mb-3">
              Delivery Information
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-[#A8A8A8]">Name</p>
                <p className="text-[#5C5C5C]">
                  {selectedOrder.customer_name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#A8A8A8]">Phone Number</p>
                <p className="text-[#5C5C5C]">
                  {selectedOrder.customer_number || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#A8A8A8]">Address</p>
                <p className="text-[#5C5C5C]">
                  {selectedOrder.customer_address || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#A8A8A8]">Delivery Method</p>
                <p className="text-[#5C5C5C]">Delivery</p>
              </div>
            </div>
            {selectedOrder.assigned_rider && (
              <div className="mt-4 pt-4 border-t border-[#E0E0E0]">
                <p className="text-sm text-[#A8A8A8]">Assigned Rider</p>
                <p className="text-[#5C5C5C]">
                  {selectedOrder.assigned_rider.username}
                </p>
                {selectedOrder.assigned_rider.phone_number && (
                  <p className="text-sm text-[#5C5C5C]">
                    {selectedOrder.assigned_rider.phone_number}
                  </p>
                )}
              </div>
            )}
          </div>

          {selectedOrder.customer_remarks && (
            <div className="mb-6 p-4 bg-[#F5F5F5] rounded-xl">
              <p className="text-sm text-[#A8A8A8] mb-1">Your Remarks</p>
              <p className="text-[#5C5C5C]">{selectedOrder.customer_remarks}</p>
            </div>
          )}

          <div className="border-t border-[#E0E0E0] pt-4">
            <h3 className="text-lg text-[#5C5C5C] mb-4">Order Items</h3>
            <div className="space-y-3">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="text-[#5C5C5C]">{item.name}</p>
                    <p className="text-sm text-[#A8A8A8]">
                      {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-[#D4A156]">
                    ₱{(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E0E0E0] mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  ₱
                  {(
                    Number(selectedOrder.total_amount) -
                    (selectedOrder.delivery_fee || 50)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="font-medium">
                  ₱{selectedOrder.delivery_fee || 50}.00
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-[#D4A156]">
                  ₱{Number(selectedOrder.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {selectedOrder.status === "pending" && (
            <div className="mt-6">
              <Button
                onClick={() => void handleCancelOrder(selectedOrder.id)}
                disabled={isCancelling}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Cancel Order
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <p className="text-[#A8A8A8] mb-4">
            This order is no longer in the current page/filter.
          </p>
          <Button onClick={() => setSelectedOrderId(null)} variant="outline">
            Back to list
          </Button>
        </div>
      )}
    </div>
  );
}
