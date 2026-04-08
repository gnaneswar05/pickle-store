"use client";

import AdminShell from "@/app/components/AdminShell";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminEditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const loadCustomer = async () => {
      try {
        const res = await fetch(`/api/admin/customers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load customer");
        }

        setName(data.data.customer.name || "");
        setEmail(data.data.customer.email || "");
        setGender(data.data.customer.gender || "");
        setPhone(data.data.customer.phone || "");
      } catch (fetchError) {
        console.error(fetchError);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load customer",
        );
      } finally {
        setPageLoading(false);
      }
    };

    loadCustomer();
  }, [id, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({
          name,
          email,
          gender,
          phone,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update customer");
      }

      router.push("/admin/customers");
    } catch (saveError) {
      console.error(saveError);
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to update customer",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell
      activeHref="/admin/customers"
      title="Edit Customer"
      subtitle="View and update customer account details from admin."
      actions={
        <Link
          href="/admin/customers"
          className="rounded-full border border-[#dccab3] bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
        >
          Back to Customers
        </Link>
      }
    >
      {pageLoading ? (
        <div className="rounded-[28px] border border-[#eadfce] bg-white p-10 text-center text-slate-600 shadow-[0_16px_45px_rgba(79,55,32,0.08)]">
          Loading customer...
        </div>
      ) : (
        <form
          onSubmit={handleSave}
          className="max-w-3xl rounded-[28px] border border-[#eadfce] bg-white p-6 shadow-[0_16px_45px_rgba(79,55,32,0.08)]"
        >
          <div className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-[#dccab3] bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-[#dccab3] bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-2xl border border-[#dccab3] bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Mobile Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value.slice(0, 10))}
                maxLength={10}
                inputMode="numeric"
                className="w-full rounded-2xl border border-[#dccab3] bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                required
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-[#f0c8bf] bg-[#fff4f1] px-4 py-3 text-sm text-[#b2412d]">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#3b2317] px-5 py-3 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
