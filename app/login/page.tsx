"use client";

import { useAuth } from "@/app/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type LoginStep = "phone" | "otp";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<LoginStep>("phone");
  const [requiresProfile, setRequiresProfile] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setAuth, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      let callback = "/";
      if (typeof window !== "undefined") {
        const urlParams = new URL(window.location.href).searchParams;
        callback = urlParams.get("callbackUrl") || "/";
      }
      router.push(callback);
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

      setRequiresProfile(Boolean(data.data.requiresProfile));
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
        body: JSON.stringify({
          phone,
          otp,
          name,
          gender,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        return;
      }

      setAuth(data.data.token, data.data.user);
      let callback = "/";
      if (typeof window !== "undefined") {
        const urlParams = new URL(window.location.href).searchParams;
        callback = urlParams.get("callbackUrl") || "/";
      }
      router.push(callback);
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
            Use your mobile number to receive a quick OTP. If this is your first
            login, we will also collect your basic account details.
          </p>
        </div>

        <div className="w-full p-6 sm:p-8">
          <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
            Login
          </h2>
          <p className="mb-6 text-center text-sm text-gray-600">
            Enter your mobile number to receive OTP.
          </p>

          {error ? (
            <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
              {error}
            </div>
          ) : null}

          {step === "phone" ? (
            <form onSubmit={handleSendOTP}>
              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">
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
                  className="w-full rounded border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full rounded bg-purple-700 py-2 text-white hover:bg-purple-800 disabled:bg-gray-400"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-4">
                <label className="mb-2 block font-bold text-gray-700">OTP</label>
                <p className="mb-2 text-sm text-gray-600">
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
                  className="w-full rounded border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {requiresProfile ? (
                <div className="mb-5 space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Complete your account
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Since this is your first login, please add your details.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block font-bold text-gray-700">
                      Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={requiresProfile}
                      className="w-full rounded border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-bold text-gray-700">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required={requiresProfile}
                      className="w-full rounded border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-bold text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required={requiresProfile}
                      className="w-full rounded border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="mb-2 w-full rounded bg-purple-700 py-2 text-white hover:bg-purple-800 disabled:bg-gray-400"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setRequiresProfile(false);
                  setName("");
                  setGender("");
                  setEmail("");
                }}
                className="w-full rounded bg-gray-300 py-2 text-gray-700 hover:bg-gray-400"
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
