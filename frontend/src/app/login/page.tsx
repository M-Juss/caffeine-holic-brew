import Link from "next/link";
import { LoginForm } from "@/forms/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fbf3ef] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-[32px] bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] p-8 sm:p-10">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fed7aa]">
            <span className="text-3xl font-bold text-[#c2410c]">☕</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#0f172a]">
              Log in to your account
            </h1>
            <p className="mt-2 text-sm text-[#64748b]">
              Enter your email and password below to log in
            </p>
          </div>
        </div>

        <LoginForm/>

        <Link
          href="/register"
          className="mt-6  text-sm text-[#475569]"
        >
          Don&apos;t have an account?
          <span className="font-medium text-[#d97706] hover:text-[#b45309] underline">
            Sign up
          </span>
        </Link>
      </section>
    </main>
  );
}
