import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Lock, Mail, ArrowLeft, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        router.push("/admin");
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#EFEBE4] elevation-2 p-8 sm:p-10 relative overflow-hidden">
          <div className="h-1.5 w-full gold-crimson-bar absolute top-0 left-0" />

          {/* Logo / Badge */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF8E1] border border-[#F5B000]/40 flex items-center justify-center mx-auto text-[#9B000E] mb-4 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-[#1C1B1B] font-kannada">
              ನಿರ್ವಾಹಕ ಲಾಗಿನ್
            </h1>
            <p className="text-xs text-[#5C403D] mt-1 font-sans">
              Kannada Koota Administration Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#916F6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  placeholder="admin@kannadakoota.org"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1B1B] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#916F6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EFEBE4] bg-[#FCF9F8] focus:bg-white text-sm text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#9B000E] transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#9B000E] hover:bg-[#7D000B] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>ಲಾಗಿನ್ ಮಾಡಿ (Sign In)</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#EFEBE4] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C403D] hover:text-[#9B000E] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Kannada Koota Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
