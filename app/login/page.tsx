"use client";

import { useAuth } from "@/app/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuth, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }

      setStep("otp");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        return;
      }

      setAuth(data.data.token, data.data.user);
      router.push("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full overflow-hidden rounded-[32px] border border-[var(--line)] bg-white shadow-[0_24px_64px_rgba(92,60,37,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-[linear-gradient(160deg,rgba(109,36,16,0.96),rgba(159,63,35,0.9),rgba(215,163,71,0.82))] p-8 text-white lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-amber-100">
            Welcome Back
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">
            Sign in to save your cart and track every order.
          </h1>
          <p className="mt-4 text-sm leading-7 text-amber-50/90">
            Use your mobile number to receive a quick OTP and continue shopping
            without losing your details.
          </p>
        </div>

        <div className="w-full p-6 sm:p-8">
        <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
         Login
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Enter your mobile number to receive OTP.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.slice(0, 10))}
                placeholder="10-digit mobile number"
                maxLength={10}
                inputMode="numeric"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">OTP</label>
              <p className="text-sm text-gray-600 mb-2">
                Enter OTP sent to {phone}
              </p>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                placeholder="6-digit OTP"
                maxLength={6}
                inputMode="numeric"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 disabled:bg-gray-400 mb-2"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
              }}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
            >
              Change Phone
            </button>
          </form>
        )}
        </div>
      </div>
    </div>
  );
}
