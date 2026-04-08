"use client";

import { useAuth, useToast } from "@/app/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const router = useRouter();
  const { token, user, setAuth, isAuthenticated } = useAuth();
  const { pushToast } = useToast();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    setName((current) => current || user.name || "");
    setGender((current) => current || user.gender || "");
    setEmail((current) => current || user.email || "");
    setPhone((current) => current || user.phone || "");
  }, [user]);

  useEffect(() => {
    const storedToken =
      token || (typeof window !== "undefined" ? localStorage.getItem("kanvi-token") : null);

    if (!storedToken && !isAuthenticated()) {
      router.push("/login");
      return;
    }

    const loadAccount = async () => {
      try {
        const res = await fetch("/api/account", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load account");
        }

        setName(data.data.user.name || "");
        setGender(data.data.user.gender || "");
        setEmail(data.data.user.email || "");
        setPhone(data.data.user.phone || "");
      } catch (fetchError) {
        console.error(fetchError);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load account",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, [isAuthenticated, router, token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const storedToken =
      token || (typeof window !== "undefined" ? localStorage.getItem("kanvi-token") : null);

    if (!storedToken) {
      setError("Please login again to update your account.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          name,
          gender,
          email,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update account");
      }

      setAuth(storedToken, data.data.user);
      pushToast({
        title: "Account updated",
        message: "Your profile details were saved successfully.",
        tone: "success",
      });
    } catch (saveError) {
      console.error(saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to update account",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[28px] border border-[var(--line)] bg-white p-10 text-center text-stone-600 shadow-[0_18px_50px_rgba(92,60,37,0.08)]">
        Loading account...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-[32px] border border-[var(--line)] bg-white p-6 shadow-[0_22px_60px_rgba(92,60,37,0.10)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--brand)]">
          Account
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--brand-deep)]">
          Manage your details
        </h1>
        <p className="mt-3 text-sm leading-7 text-stone-600">
          Keep your profile up to date so orders, notifications, and support
          stay accurate.
        </p>

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSave} className="mt-8 grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-[var(--line)] px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-2xl border border-[var(--line)] px-4 py-3 outline-none"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[var(--line)] px-4 py-3 outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Mobile Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.slice(0, 10))}
              className="w-full rounded-2xl border border-[var(--line)] px-4 py-3 outline-none"
              maxLength={10}
              inputMode="numeric"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[var(--brand-deep)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
