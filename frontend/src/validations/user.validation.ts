import { z } from "zod";

export const createRiderSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .max(255, "Username must be less than 255 characters"),
    email: z
      .string()
      .email("Invalid email address")
      .max(255, "Email must be less than 255 characters"),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
    phone_number: z
      .string()
      .trim()
      .nonempty("Phone Number is Required")
      .regex(/^(09|\+639|639)\d{9}$/, "Invalid Phone Number"),
    role: z.literal("rider"),
    status: z.enum(["active", "inactive"], {
      message: "Status must be either active or inactive",
    }),
  })
  .refine(
    (data) => {
      if (data.password || data.password_confirmation) {
        return data.password === data.password_confirmation;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["password_confirmation"],
    },
  );

export type CreateRiderInput = z.infer<typeof createRiderSchema>;

export const createAdminSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .max(255, "Username must be less than 255 characters"),
    email: z
      .string()
      .email("Invalid email address")
      .max(255, "Email must be less than 255 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z
      .string()
      .min(8, "Password confirmation is required"),
    phone_number: z
      .string()
      .trim()
      .nonempty("Phone Number is Required")
      .regex(/^(09|\+639|639)\d{9}$/, "Invalid Phone Number"),
    role: z.literal("admin"),
    status: z.enum(["active", "inactive"], {
      message: "Status must be either active or inactive",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type CreateAdminInput = z.infer<typeof createAdminSchema>;

export const editAdminSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .max(255, "Username must be less than 255 characters"),
    email: z
      .string()
      .email("Invalid email address")
      .max(255, "Email must be less than 255 characters"),
    phone_number: z
      .string()
      .trim()
      .nonempty("Phone Number is Required")
      .regex(/^(09|\+639|639)\d{9}$/, "Invalid Phone Number"),
    status: z.enum(["active", "inactive"], {
      message: "Status must be either active or inactive",
    }),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password || data.password_confirmation) {
        return data.password === data.password_confirmation;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["password_confirmation"],
    },
  )
  .refine(
    (data) => {
      if (data.password) {
        return data.password.length >= 8;
      }
      return true;
    },
    {
      message: "Password must be at least 8 characters",
      path: ["password"],
    },
  );

export type EditAdminInput = z.infer<typeof editAdminSchema>;

export const editRiderSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(255, "Username must be less than 255 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone_number: z
    .string()
    .trim()
    .nonempty("Phone Number is Required")
    .regex(/^(09|\+639|639)\d{9}$/, "Invalid Phone Number"),
  status: z.enum(["active", "inactive"], {
    message: "Status must be either active or inactive",
  }),
});

export type EditRiderInput = z.infer<typeof editRiderSchema>;
