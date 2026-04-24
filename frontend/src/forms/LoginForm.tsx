"use client";

import { InputWithLabel } from "@/components/common/InputWithLabel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginUser } from "@/services/auth.api";
import { LoginFormValues, loginSchema } from "@/validations/auth.validation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await loginUser(values.email, values.password);
      toast.success("Login successful.");
      const role = (response?.data?.role ?? "").toLowerCase();
      router.push(role === "admin" ? "/admin" : "/customer");
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

      if (err.errors?.password) {
        const passwordError = Array.isArray(err.errors.password)
          ? err.errors.password[0]
          : err.errors.password;
        setError("password", { type: "server", message: passwordError });
      }

      if (!err.errors?.email && !err.errors?.password && err.message) {
        setError("password", { type: "server", message: err.message });
      }

      toast.error(err.message || "Login failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
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
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#f3961c] hover:bg-[#f3961c]/90  mb-4 w-full text-white py-2 px-4 rounded-md transition duration-300"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
