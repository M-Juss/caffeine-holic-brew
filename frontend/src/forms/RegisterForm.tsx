"use client";

import { InputWithLabel } from "@/components/common/InputWithLabel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createNewCustomer } from "@/services/auth.api";
import {
  CreateAccountFormValues,
  createAccountSchema,
} from "@/validations/auth.validation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateAccountFormValues>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async (values: CreateAccountFormValues) => {
    if (values.password !== values.password_confirmation) {
      setError("password_confirmation", {
        type: "manual",
        message: "Password do not match",
      });
      toast.error("Password and confirm password do not match.");
      return;
    }

    try {
      await createNewCustomer(
        values.username,
        values.email,
        values.address,
        values.contact_number,
        values.password,
        values.password_confirmation,
        "customer",
      );

      toast.success("Account created successfully.");
      router.push("/login");
    } catch (error) {
      const err = error as Error & {
        errors?: Record<string, string[] | string>;
      };

      if (err.errors?.email) {
        const emailError = Array.isArray(err.errors.email)
          ? err.errors.email[0]
          : err.errors.email;
        setError("email", { type: "server", message: emailError });
      }

      toast.error(err.message || "Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="mb-4">
        <InputWithLabel
          id="username"
          type="text"
          label="Userame"
          placeholder="Enter your username"
          className="h-10 border-gray-300 focus-visible:ring-accent/40"
          {...register("username")}
        />
        {errors.username && (
          <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
        )}
      </div>
      <div className="mb-4">
        <InputWithLabel
          id="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          className="h-10 border-gray-300 focus-visible:ring-accent/40"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-4">
        <InputWithLabel
          id="address"
          type="text"
          label="Address"
          placeholder="Enter your complete address"
          className="h-10 border-gray-300 focus-visible:ring-accent/40"
          {...register("address")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-4">
        <InputWithLabel
          id="contact_number"
          type="text"
          label="Contact Number"
          placeholder="Enter your contact number"
          className="h-10 border-gray-300 focus-visible:ring-accent/40"
          {...register("contact_number")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-4">
        <InputWithLabel
          id="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          className="h-10 border-gray-300 focus-visible:ring-accent/40"
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="mb-4">
        <InputWithLabel
          id="password_confirmation"
          type="password"
          label="Confirm Password"
          placeholder="Enter your password"
          className="h-10 border-gray-300 focus-visible:ring-accent/40"
          {...register("password_confirmation")}
        />
        {errors.password_confirmation && (
          <p className="mt-1 text-xs text-red-500">
            {errors.password_confirmation.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#f3961c] hover:bg-[#f3961c]/90 mb-4 w-full text-white py-2 px-4 rounded-md transition duration-300"
      >
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
