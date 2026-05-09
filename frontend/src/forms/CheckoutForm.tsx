"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { checkoutCart } from "@/services/cart.api";
import { getProfile } from "@/services/profile.api";
import { toast } from "sonner";

interface CartItem {
  id: number;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutFormProps {
  cartItems: CartItem[];
  cartTotal: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const DELIVERY_FEE = 50;

export default function CheckoutForm({
  cartItems,
  cartTotal,
  onSuccess,
  onCancel,
}: CheckoutFormProps) {
  const [customerData, setCustomerData] = useState<{
    username: string;
    email: string;
    address: string;
    phone_number: string;
  } | null>(null);
  const [customer_remarks, setCustomerRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = cartTotal + DELIVERY_FEE;

  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        const response = await getProfile();
        setCustomerData({
          username: response.data.user.username,
          email: response.data.user.email,
          address: response.data.user.address || "",
          phone_number: response.data.user.phone_number || "",
        });
      } catch {
        toast.error("Failed to load customer data");
      } finally {
        setIsLoading(false);
      }
    };

    void loadCustomerData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!customerData) {
        toast.error("Customer data not loaded");
        setIsSubmitting(false);
        return;
      }

      const response = await checkoutCart({
        delivery_method: "delivery",
        payment: totalAmount,
        customer_remarks,
        discount_amount: 0,
        customer_name: customerData.username,
        customer_number: customerData.phone_number,
        customer_address: customerData.address,
      });

      toast.success("Order placed successfully!");
      onSuccess();
      window.location.href = "/customer?tab=orders";
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading customer data...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-h-[80vh] overflow-y-auto"
    >
      <div>
        <h3 className="text-lg font-semibold text-[#5C5C5C] mb-4">
          Delivery Information
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-[#A8A8A8]">Name</p>
            <p className="text-[#5C5C5C]">{customerData?.username || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-[#A8A8A8]">Phone Number</p>
            <p className="text-[#5C5C5C]">
              {customerData?.phone_number || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#A8A8A8]">Address</p>
            <p className="text-[#5C5C5C]">{customerData?.address || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-[#A8A8A8]">Delivery Method</p>
            <p className="text-[#5C5C5C]">Delivery</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#5C5C5C] mb-4">
          Order Items
        </h3>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 pb-3 border-b border-[#E0E0E0]"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="text-[#5C5C5C] text-sm">{item.name}</h4>
                <p className="text-xs text-[#A8A8A8]">
                  {item.size} × {item.quantity}
                </p>
              </div>
              <div className="text-[#D4A156] text-sm">
                ₱{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="customer_remarks" className="text-sm font-medium">
          Remarks (Optional)
        </label>
        <textarea
          id="customer_remarks"
          value={customer_remarks}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setCustomerRemarks(e.target.value)
          }
          placeholder="Any special instructions..."
          rows={2}
          className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
        />
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">₱{cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Fee:</span>
          <span className="font-medium">₱{DELIVERY_FEE.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total Amount:</span>
          <span className="text-[#D4A156]">₱{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[#D4A156] hover:bg-[#C59145]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
}
