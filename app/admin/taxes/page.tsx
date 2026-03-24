"use client";

import AdminShell from "@/app/components/AdminShell";
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
  const [codLimit, setCodLimit] = useState(250);
  const [codLimitDraft, setCodLimitDraft] = useState("250");
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
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
        setCodLimit(data.data.codLimit || 250);
        setCodLimitDraft(String(data.data.codLimit || 250));
      } catch (error) {
        console.error("Error fetching taxes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxes();
  }, [router]);

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

  const handleSaveOrderSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/taxes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({
          deliveryCharge: Number(deliveryDraft),
          codLimit: Number(codLimitDraft),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update delivery charge");
      }

      setTaxes(data.data.taxes || []);
      setDeliveryCharge(data.data.deliveryCharge || 0);
      setDeliveryDraft(String(data.data.deliveryCharge || 0));
      setCodLimit(data.data.codLimit || 250);
      setCodLimitDraft(String(data.data.codLimit || 250));
    } catch (error) {
      console.error("Error updating delivery charge:", error);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <AdminShell
      activeHref="/admin/taxes"
      title="Taxes & Delivery"
      subtitle="Manage invoice taxes, COD limits, and delivery charges."
    >
        {loading ? (
          <div className="rounded-xl border border-gray-200/50 bg-white p-10 text-center text-gray-600 shadow-sm">
            Loading tax settings...
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200/50 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900">
                  Order Settings
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-2 block font-bold text-gray-700">
                      Delivery Charge
                    </label>
                    <p className="mb-2 text-sm text-gray-600">
                      Current charge: Rs. {deliveryCharge.toFixed(2)}
                    </p>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={deliveryDraft}
                      onChange={(e) => setDeliveryDraft(e.target.value)}
                      className="w-full rounded border border-gray-300 px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-bold text-gray-700">
                      COD Limit
                    </label>
                    <p className="mb-2 text-sm text-gray-600">
                      COD allowed only below Rs. {codLimit.toFixed(2)}
                    </p>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={codLimitDraft}
                      onChange={(e) => setCodLimitDraft(e.target.value)}
                      className="w-full rounded border border-gray-300 px-4 py-2"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveOrderSettings}
                    disabled={savingSettings}
                    className="rounded bg-purple-700 px-4 py-2 font-semibold text-white hover:bg-purple-800 disabled:bg-gray-400"
                  >
                    {savingSettings ? "Saving..." : "Save Settings"}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200/50 bg-white p-6 shadow-sm">
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

            <div className="rounded-xl border border-gray-200/50 bg-white shadow-sm">
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
    </AdminShell>
  );
}
