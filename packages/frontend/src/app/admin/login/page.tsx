"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@repo/shared-utils";
import { authService } from "@/lib/auth-service";
import { ShieldCheck, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      login({ email, password, rememberMe }, response);
      const returnTo = searchParams.get("returnTo") || "/";
      router.push(returnTo);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#F2F2F7] font-sans selection:bg-[#007AFF] selection:text-white">
      {/* Apple Mesh Gradient Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-[#007AFF]/15 to-[#5856D6]/15 blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#34C759]/15 to-[#32ADE6]/15 blur-[100px] pointer-events-none mix-blend-multiply" />

      <div className="w-full max-w-[420px] px-6 relative z-10">
        <div className="flex justify-center mb-8">
          <Link
            href="/"
            className="text-[15px] font-medium text-[#8E8E93] hover:text-black transition-colors flex items-center gap-1"
          >
            ← Quay lại trang chủ
          </Link>
        </div>

        {/* Apple Glass Card */}
        <div className="bg-white/70 backdrop-blur-3xl rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-[18px] bg-gradient-to-b from-gray-800 to-black flex items-center justify-center mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
              <ShieldCheck size={32} className="text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-[24px] font-semibold text-black tracking-tight">
              Phú Cường Thịnh
            </h2>
            <p className="mt-1 text-[15px] font-medium text-[#8E8E93]">
              Hệ thống quản trị nội dung
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-[14px] bg-[#FF3B30]/10 p-4 flex items-start gap-3">
                <AlertCircle
                  className="text-[#FF3B30] shrink-0 mt-0.5"
                  size={18}
                />
                <p className="text-[14px] text-[#FF3B30] font-medium leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {/* Apple Inputs */}
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  required
                  className="w-full bg-black/[0.04] border-2 border-transparent rounded-[14px] py-3.5 px-4 text-[17px] text-black placeholder-[#8E8E93] focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all outline-none"
                  placeholder="Tên đăng nhập"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="w-full bg-black/[0.04] border-2 border-transparent rounded-[14px] py-3.5 pl-4 pr-12 text-[17px] text-black placeholder-[#8E8E93] focus:bg-white focus:border-[#007AFF] focus:ring-4 focus:ring-[#007AFF]/10 transition-all outline-none"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#8E8E93] hover:text-black transition-colors outline-none"
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={1.5} />
                  ) : (
                    <Eye size={20} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-[18px] h-[18px] rounded-[6px] border-gray-300 text-[#007AFF] focus:ring-[#007AFF] transition-colors cursor-pointer"
                />
                <span className="text-[15px] font-medium text-[#8E8E93] group-hover:text-black transition-colors">
                  Ghi nhớ tôi
                </span>
              </label>

              <Link
                href="/forgot-password"
                className="text-[15px] font-medium text-[#007AFF] hover:opacity-80 transition-opacity"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full mt-2 py-3.5 bg-[#007AFF] text-white text-[17px] font-semibold rounded-[14px] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Đăng Nhập"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7]">
          <Loader2 size={32} className="animate-spin text-[#8E8E93]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
