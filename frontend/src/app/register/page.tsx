import Link from "next/link";
import { RegisterForm } from "@/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#fbf3ef] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-[32px] bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] p-8 sm:p-10">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex h-15 w-15 items-center justify-center rounded-full bg-[#fed7aa]">
            <span className="text-3xl font-bold text-[#c2410c]">☕</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#0f172a]">Create your account</h1>
            <p className="mt-1 text-sm text-[#64748b]">
              Fill in your details to start your account
            </p>
          </div>
        </div>

        <RegisterForm/>
        
        <Link href="/login" className="mt-1 flex items-center  justify-center text-sm text-[#475569]">
          Already have an account?
          <span className="font-medium text-[#d97706] hover:text-[#b45309] underline">
            Log in
          </span>
        </Link>

      </section>
    </main>
  );
}
