"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TaxItem {
  _id: string;
  name: string;
  rate: number;
  isActive: boolean;
}

export default function AdminTaxesPage() {
  const router = useRouter();
  const [taxes, setTaxes] = useState<TaxItem[]>([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [deliveryDraft, setDeliveryDraft] = useState("0");
  const [loading, setLoading] = useState(true);
  const [savingDelivery, setSavingDelivery] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    rate: "",
    isActive: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchTaxes = async () => {
      try {
        const res = await fetch("/api/taxes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch tax settings");
        }

        setTaxes(data.data.taxes || []);
        setDeliveryCharge(data.data.deliveryCharge || 0);
        setDeliveryDraft(String(data.data.deliveryCharge || 0));
      } catch (error) {
        console.error("Error fetching taxes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxes();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin-token");
    router.push("/admin/login");
  };

  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      rate: "",
      isActive: true,
    });
  };

  const handleSaveTax = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const isEditing = Boolean(form.id);
      const endpoint = isEditing ? `/api/taxes/${form.id}` : "/api/taxes";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({
          name: form.name,
          rate: Number(form.rate),
          isActive: form.isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save tax");
      }

      setTaxes(data.data.taxes || []);
      setDeliveryCharge(data.data.deliveryCharge || 0);
      resetForm();
    } catch (error) {
      console.error("Error saving tax:", error);
    }
  };

  const handleEditTax = (tax: TaxItem) => {
    setForm({
      id: tax._id,
      name: tax.name,
      rate: String(tax.rate),
      isActive: tax.isActive,
    });
  };

  const handleDeleteTax = async (id: string) => {
    if (!confirm("Delete this tax?")) return;

    try {
      const res = await fetch(`/api/taxes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete tax");
      }

      setTaxes(data.data.taxes || []);
      if (form.id === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Error deleting tax:", error);
    }
  };

  const handleSaveDelivery = async () => {
    setSavingDelivery(true);
    try {
      const res = await fetch("/api/taxes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({
          deliveryCharge: Number(deliveryDraft),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update delivery charge");
      }

      setTaxes(data.data.taxes || []);
      setDeliveryCharge(data.data.deliveryCharge || 0);
      setDeliveryDraft(String(data.data.deliveryCharge || 0));
    } catch (error) {
      console.error("Error updating delivery charge:", error);
    } finally {
      setSavingDelivery(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-700 text-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Kanvi Admin</h1>
          <button
            onClick={handleLogout}
            className="rounded bg-red-500 px-4 py-2 hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 rounded-lg bg-white shadow">
          <div className="flex gap-4 overflow-x-auto px-6 py-4">
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-purple-700">
              Dashboard
            </Link>
            <Link href="/admin/products" className="text-gray-600 hover:text-purple-700">
              Products
            </Link>
            <Link href="/admin/banners" className="text-gray-600 hover:text-purple-700">
              Banners
            </Link>
            <Link href="/admin/orders" className="text-gray-600 hover:text-purple-700">
              Orders
            </Link>
            <Link href="/admin/coupons" className="text-gray-600 hover:text-purple-700">
              Coupons
            </Link>
            <Link
              href="/admin/taxes"
              className="font-bold text-purple-700 hover:text-purple-900"
            >
              Taxes
            </Link>
          </div>
        </nav>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Taxes & Delivery</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage invoice taxes and the delivery charge applied during checkout.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-600">Loading...</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-xl font-bold text-gray-900">
                  Delivery Charge
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Current charge: Rs. {deliveryCharge.toFixed(2)}
                </p>
                <div className="mt-4 flex gap-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={deliveryDraft}
                    onChange={(e) => setDeliveryDraft(e.target.value)}
                    className="w-full rounded border border-gray-300 px-4 py-2"
                  />
                  <button
                    type="button"
                    onClick={handleSaveDelivery}
                    disabled={savingDelivery}
                    className="rounded bg-purple-700 px-4 py-2 font-semibold text-white hover:bg-purple-800 disabled:bg-gray-400"
                  >
                    {savingDelivery ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow">
                <h3 className="text-xl font-bold text-gray-900">
                  {form.id ? "Edit Tax" : "Add Tax"}
                </h3>
                <form onSubmit={handleSaveTax} className="mt-4 space-y-4">
                  <div>
                    <label className="mb-2 block font-bold text-gray-700">
                      Tax Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm((current) => ({ ...current, name: e.target.value }))
                      }
                      required
                      className="w-full rounded border border-gray-300 px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-bold text-gray-700">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.rate}
                      onChange={(e) =>
                        setForm((current) => ({ ...current, rate: e.target.value }))
                      }
                      required
                      className="w-full rounded border border-gray-300 px-4 py-2"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          isActive: e.target.checked,
                        }))
                      }
                    />
                    Active on checkout and invoice
                  </label>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="rounded bg-purple-700 px-5 py-2 font-semibold text-white hover:bg-purple-800"
                    >
                      {form.id ? "Update Tax" : "Add Tax"}
                    </button>
                    {form.id ? (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="rounded border border-gray-300 px-5 py-2 font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </form>
              </div>
            </div>

            <div className="rounded-lg bg-white shadow">
              <div className="border-b px-6 py-4">
                <h3 className="text-xl font-bold text-gray-900">Configured Taxes</h3>
              </div>
              {taxes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left font-bold">Name</th>
                        <th className="px-6 py-3 text-left font-bold">Rate</th>
                        <th className="px-6 py-3 text-left font-bold">Status</th>
                        <th className="px-6 py-3 text-left font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxes.map((tax) => (
                        <tr key={tax._id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-3 font-semibold">{tax.name}</td>
                          <td className="px-6 py-3">{tax.rate}%</td>
                          <td className="px-6 py-3">
                            <span
                              className={`rounded px-2 py-1 text-sm ${
                                tax.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {tax.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="space-x-3 px-6 py-3">
                            <button
                              type="button"
                              onClick={() => handleEditTax(tax)}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTax(tax._id)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-6 py-12 text-center text-gray-600">
                  No taxes configured yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
