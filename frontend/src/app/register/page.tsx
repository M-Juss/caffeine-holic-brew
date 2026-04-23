import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#fbf3ef] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-[32px] bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] p-8 sm:p-10">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fed7aa]">
            <span className="text-3xl font-bold text-[#c2410c]">☕</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#0f172a]">Create your account</h1>
            <p className="mt-2 text-sm text-[#64748b]">
              Fill in your details to start your account
            </p>
          </div>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#334155]">Username</label>
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-[16px] border border-[#e2e8f0] bg-[#f9f5f1] px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#f59e0b] focus:ring-2 focus:ring-[#fde68a]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#334155]">Email address</label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full rounded-[16px] border border-[#e2e8f0] bg-[#f9f5f1] px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#f59e0b] focus:ring-2 focus:ring-[#fde68a]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#334155]">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-[16px] border border-[#e2e8f0] bg-[#f9f5f1] px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#f59e0b] focus:ring-2 focus:ring-[#fde68a]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#334155]">Confirm password</label>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full rounded-[16px] border border-[#e2e8f0] bg-[#f9f5f1] px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#f59e0b] focus:ring-2 focus:ring-[#fde68a]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-[16px] bg-[#f59e0b] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#ea580c]"
          >
            Sign up
          </button>
        </form>

        <Link href="/login" className="mt-6 text-center text-sm text-[#475569]">
          Already have an account?
          <a href="#" className="font-medium text-[#d97706] hover:text-[#b45309] underline">
            Log in
          </a>
        </Link>
      </section>
    </main>
  );
}
