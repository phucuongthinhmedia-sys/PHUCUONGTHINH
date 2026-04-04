"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@repo/shared-utils";
import { authService } from "@/lib/auth-service";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

// Bảng màu đồng bộ
const palette = {
  be: "#FDF5E6",
  brown: "#804000",
  lightBrown: "#D2B48C",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State ẩn/hiện mật khẩu
  const [rememberMe, setRememberMe] = useState(false); // State ghi nhớ đăng nhập
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      // Giả sử hàm login có thể nhận thêm tuỳ chọn rememberMe
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
    <div
      style={{ backgroundColor: palette.be }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans selection:bg-[#804000] selection:text-white"
    >
      {/* ─── Background Elements (Soft Blobs) ─── */}
      <div
        style={{ backgroundColor: palette.lightBrown }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-30 pointer-events-none"
      />
      <div
        style={{ backgroundColor: palette.brown }}
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 pointer-events-none"
      />

      <div className="max-w-md w-full px-6 relative z-10">
        {/* Nút quay lại trang chủ */}
        <div className="flex justify-center mb-8">
          <Link
            href="/"
            style={{ color: palette.brown }}
            className="text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
          >
            ← Quay lại trang chủ
          </Link>
        </div>

        {/* ─── Glassmorphism Card ─── */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[40px] shadow-[0_20px_60px_rgba(128,64,0,0.05)] border border-white/80 p-8 sm:p-10">
          {/* Header Form */}
          <div className="flex flex-col items-center mb-8">
            <div
              style={{ backgroundColor: palette.brown }}
              className="size-16 rounded-[20px] flex items-center justify-center mb-6 shadow-lg shadow-[#804000]/20"
            >
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h2
              style={{ color: palette.brown }}
              className="text-2xl font-black tracking-tight uppercase"
            >
              Hệ Thống Quản Trị
            </h2>
            <p
              style={{ color: palette.brown }}
              className="mt-2 text-sm font-medium opacity-70"
            >
              Phú Cường Thịnh CMS
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Cảnh báo lỗi */}
            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle
                  className="text-red-500 shrink-0 mt-0.5"
                  size={18}
                />
                <p className="text-sm text-red-700 font-medium leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {/* Input Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  style={{ color: palette.brown }}
                  className="block text-sm font-bold pl-4 opacity-80"
                >
                  Email đăng nhập
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-5 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity"
                    style={{ color: palette.brown }}
                    size={18}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    style={{
                      color: palette.brown,
                      borderColor: "rgba(210, 180, 140, 0.4)",
                    }}
                    className="block w-full bg-white/50 border rounded-full py-3.5 pl-12 pr-6 text-[15px] font-medium placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#804000]/20 focus:bg-white transition-all shadow-sm"
                    placeholder="admin@phucuongthinh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  style={{ color: palette.brown }}
                  className="block text-sm font-bold pl-4 opacity-80"
                >
                  Mật khẩu
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-5 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 transition-opacity"
                    style={{ color: palette.brown }}
                    size={18}
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    style={{
                      color: palette.brown,
                      borderColor: "rgba(210, 180, 140, 0.4)",
                    }}
                    className="block w-full bg-white/50 border rounded-full py-3.5 pl-12 pr-12 text-[15px] font-medium placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#804000]/20 focus:bg-white transition-all shadow-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {/* Nút Toggle Password */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 opacity-40 hover:opacity-100 focus:opacity-100 transition-opacity outline-none rounded-full"
                    style={{ color: palette.brown }}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#804000] focus:ring-[#804000] transition-colors cursor-pointer"
                  style={{ accentColor: palette.brown }}
                />
                <span
                  style={{ color: palette.brown }}
                  className="text-sm font-semibold opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  Ghi nhớ tôi
                </span>
              </label>

              <Link
                href="/forgot-password" // Cập nhật đường dẫn thực tế của bạn
                style={{ color: palette.brown }}
                className="text-sm font-bold opacity-80 hover:opacity-100 hover:underline transition-all"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              style={{ backgroundColor: palette.brown }}
              className="w-full mt-2 py-4 px-6 text-white text-[15px] font-bold rounded-full transition-all flex items-center justify-center gap-2 hover:bg-[#6e2411] hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none group"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                <>
                  Đăng Nhập
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
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
        <div
          style={{ backgroundColor: palette.be, color: palette.brown }}
          className="min-h-screen flex items-center justify-center font-bold"
        >
          <Loader2 size={32} className="animate-spin opacity-50" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
