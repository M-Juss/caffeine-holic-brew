import { z } from "zod";

export const checkoutSchema = z.object({
  delivery_method: z.enum(["pick_up", "delivery"], {
    message: "Delivery method is required",
  }),
  payment: z
    .string()
    .min(1, "Payment is required")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), "Payment must be a valid number"),
  customer_remarks: z
    .string()
    .max(500, "Remarks must be less than 500 characters")
    .optional(),
  discount_amount: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .refine(
      (val) => val === undefined || !isNaN(val),
      "Discount must be a valid number",
    )
    .refine(
      (val) => val === undefined || val >= 0,
      "Discount must be at least 0",
    ),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
