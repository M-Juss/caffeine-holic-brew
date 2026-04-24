import { z } from "zod";

const menuCategories = ["Coffee", "Non Coffee", "Pastries", "Snacks"] as const;
const availabilityValues = ["available", "unavailable"] as const;

export const menuSizeSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Size name is required"),
  price: z.coerce.number().positive("Size price must be greater than 0"),
});

export const addMenuSchema = z.object({
  image: z.string().trim().min(1, "Please select an image"),
  name: z.string().trim().min(1, "Menu name is required"),
  category: z.enum(menuCategories, {
    message: "Please select a valid category",
  }),
  availability: z.enum(availabilityValues, {
    message: "Please select availability",
  }),
  description: z.string().trim().min(1, "Description is required"),
  sizes: z
    .array(menuSizeSchema)
    .min(1, "Please add at least one size or variant"),
});

export const editMenuSchema = addMenuSchema;

export type AddMenuFormValues = z.infer<typeof addMenuSchema>;
export type EditMenuFormValues = z.infer<typeof editMenuSchema>;
