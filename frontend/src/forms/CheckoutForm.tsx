"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/common/InputWithLabel";
import { SelectWithLabel } from "@/components/common/SelectWithLabel";
import { checkoutSchema } from "@/validations/checkout.validation";
import { checkoutCart } from "@/services/cart.api";
import { toast } from "sonner";

interface CheckoutFormProps {
  cartTotal: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const DELIVERY_FEE = 50;

export default function CheckoutForm({
  cartTotal,
  onSuccess,
  onCancel,
}: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    delivery_method: "pick_up" as "pick_up" | "delivery",
    payment: "",
    customer_remarks: "",
    discount_amount: "",
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount =
    formData.delivery_method === "delivery"
      ? cartTotal + DELIVERY_FEE
      : cartTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = checkoutSchema.parse(formData);

      if (validatedData.payment < totalAmount) {
        setErrors({
          payment: `Payment must be at least ₱${totalAmount.toFixed(2)}`,
        });
        setIsSubmitting(false);
        return;
      }

      const response = await checkoutCart({
        delivery_method: validatedData.delivery_method,
        payment: validatedData.payment,
        customer_remarks: validatedData.customer_remarks,
        discount_amount: validatedData.discount_amount,
      });

      toast.success("Order placed successfully!");
      onSuccess();
      window.location.href = "/customer?tab=orders";
    } catch (error) {
      if (error instanceof Error) {
        // toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <SelectWithLabel
        id="delivery_method"
        label="Delivery Method"
        placeholder="Select delivery method"
        options={[
          { value: "pick_up", label: "Pick Up" },
          { value: "delivery", label: "Delivery" },
        ]}
        defaultValue={formData.delivery_method}
        onValueChange={(value: string) =>
          setFormData({
            ...formData,
            delivery_method: value as "pick_up" | "delivery",
          })
        }
      />
      {errors.delivery_method && (
        <p className="text-sm text-red-500 mt-1">{errors.delivery_method}</p>
      )}

      <InputWithLabel
        id="payment"
        label="Amount to Pay"
        type="number"
        step="0.01"
        value={formData.payment}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFormData({ ...formData, payment: e.target.value })
        }
        placeholder="Enter payment amount"
      />
      {errors.payment && (
        <p className="text-sm text-red-500 mt-1">{errors.payment}</p>
      )}

      <div>
        <label htmlFor="customer_remarks" className="text-sm font-medium">
          Remarks (Optional)
        </label>
        <textarea
          id="customer_remarks"
          value={formData.customer_remarks}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData({ ...formData, customer_remarks: e.target.value })
          }
          placeholder="Any special instructions..."
          rows={3}
          className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
        />
        {errors.customer_remarks && (
          <p className="text-sm text-red-500 mt-1">{errors.customer_remarks}</p>
        )}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Cart Total:</span>
          <span className="font-medium">₱{cartTotal.toFixed(2)}</span>
        </div>
        {formData.delivery_method === "delivery" && (
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee:</span>
            <span className="font-medium">₱{DELIVERY_FEE.toFixed(2)}</span>
          </div>
        )}
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
