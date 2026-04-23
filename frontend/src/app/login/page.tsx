import Link from "next/link";

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

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#334155]">
              Email address
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className="w-full rounded-[16px] border border-[#e2e8f0] bg-[#f9f5f1] px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#f59e0b] focus:ring-2 focus:ring-[#fde68a]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <label className="block text-sm font-medium text-[#334155]">
                Password
              </label>
              <a
                href="#"
                className="text-sm font-medium text-[#d97706] hover:text-[#b45309]"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-[16px] border border-[#e2e8f0] bg-[#f9f5f1] px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#f59e0b] focus:ring-2 focus:ring-[#fde68a]"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-[#cbd5e1] text-[#2563eb] focus:ring-[#2563eb]"
            />
            <label htmlFor="remember" className="text-sm text-[#475569]">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-[16px] bg-[#f59e0b] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#ea580c]"
          >
            Log in
          </button>
        </form>

        <Link href="/register" className="mt-6 text-center text-sm text-[#475569]">
          Don&apos;t have an account?
          <a
            href="#"
            className="font-medium text-[#d97706] hover:text-[#b45309] underline"
          >
            Sign up
          </a>
        </Link>
      </section>
    </main>
  );
}
