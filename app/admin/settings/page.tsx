"use client";

import AdminShell from "@/app/components/AdminShell";
import { parseServiceablePincodes } from "@/lib/utils/serviceable-pincodes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SiteSettingsForm {
  brandName: string;
  logoUrl: string;
  manufacturerName: string;
  manufacturerPhone: string;
  manufacturerEmail: string;
  manufacturerGstin: string;
  manufacturerAddressLine1: string;
  manufacturerAddressLine2: string;
  manufacturerCity: string;
  manufacturerState: string;
  manufacturerPincode: string;
  serviceablePincodes: string[];
}

const initialForm: SiteSettingsForm = {
  brandName: "",
  logoUrl: "",
  manufacturerName: "",
  manufacturerPhone: "",
  manufacturerEmail: "",
  manufacturerGstin: "",
  manufacturerAddressLine1: "",
  manufacturerAddressLine2: "",
  manufacturerCity: "",
  manufacturerState: "",
  manufacturerPincode: "",
  serviceablePincodes: [],
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState<SiteSettingsForm>(initialForm);
  const [pincodeDraft, setPincodeDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/site-settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch site settings");
        }

        setForm({
          brandName: data.data.settings.brandName || "",
          logoUrl: data.data.settings.logoUrl || "",
          manufacturerName: data.data.settings.manufacturerName || "",
          manufacturerPhone: data.data.settings.manufacturerPhone || "",
          manufacturerEmail: data.data.settings.manufacturerEmail || "",
          manufacturerGstin: data.data.settings.manufacturerGstin || "",
          manufacturerAddressLine1:
            data.data.settings.manufacturerAddressLine1 || "",
          manufacturerAddressLine2:
            data.data.settings.manufacturerAddressLine2 || "",
          manufacturerCity: data.data.settings.manufacturerCity || "",
          manufacturerState: data.data.settings.manufacturerState || "",
          manufacturerPincode: data.data.settings.manufacturerPincode || "",
          serviceablePincodes: data.data.settings.serviceablePincodes || [],
        });
        setPincodeDraft(
          (data.data.settings.serviceablePincodes || []).join("\n"),
        );
      } catch (error) {
        console.error("Error fetching site settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaveMessage("");
    try {
      const serviceablePincodes = parseServiceablePincodes(pincodeDraft);
      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: JSON.stringify({
          ...form,
          serviceablePincodes,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save site settings");
      }

      setForm((current) => ({
        ...current,
        serviceablePincodes: data.data.settings.serviceablePincodes || [],
      }));
      setPincodeDraft(
        (data.data.settings.serviceablePincodes || []).join("\n"),
      );
      setSaveMessage("Settings saved successfully.");
    } catch (error) {
      console.error("Error saving site settings:", error);
      setSaveError(
        error instanceof Error ? error.message : "Failed to save site settings",
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePincodeFileImport = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const importedPincodes = parseServiceablePincodes(text);
      setPincodeDraft(importedPincodes.join("\n"));
      setForm((current) => ({
        ...current,
        serviceablePincodes: importedPincodes,
      }));
      setSaveError("");
      setSaveMessage(`Imported ${importedPincodes.length} pincodes.`);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Failed to import pincodes",
      );
      setSaveMessage("");
    } finally {
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <AdminShell
        activeHref="/admin/settings"
        title="Site Settings"
        subtitle="These details are used in invoices and seller information."
      >
        <div className="rounded-xl border border-gray-200/50 bg-white p-10 text-center text-gray-600 shadow-sm">
          Loading settings...
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      activeHref="/admin/settings"
      title="Site Settings"
      subtitle="These details are used in invoices, seller information, and delivery area control."
    >
        <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6 rounded-xl border border-gray-200/50 bg-white p-6 shadow-sm">
            <div>
              <label className="mb-2 block font-bold text-gray-700">Brand Name</label>
              <input name="brandName" value={form.brandName} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Logo URL</label>
              <input name="logoUrl" value={form.logoUrl} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Manufacturer Name</label>
              <input name="manufacturerName" value={form.manufacturerName} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Phone</label>
              <input name="manufacturerPhone" value={form.manufacturerPhone} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Email</label>
              <input name="manufacturerEmail" value={form.manufacturerEmail} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">GSTIN</label>
              <input name="manufacturerGstin" value={form.manufacturerGstin} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
          </div>

          <div className="space-y-6 rounded-xl border border-gray-200/50 bg-white p-6 shadow-sm">
            <div>
              <label className="mb-2 block font-bold text-gray-700">Address Line 1</label>
              <textarea name="manufacturerAddressLine1" value={form.manufacturerAddressLine1} onChange={handleChange} rows={3} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Address Line 2</label>
              <input name="manufacturerAddressLine2" value={form.manufacturerAddressLine2} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">City</label>
              <input name="manufacturerCity" value={form.manufacturerCity} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">State</label>
              <input name="manufacturerState" value={form.manufacturerState} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Pincode</label>
              <input name="manufacturerPincode" value={form.manufacturerPincode} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Serviceable Pincodes
              </label>
              <textarea
                value={pincodeDraft}
                onChange={(e) => {
                  setPincodeDraft(e.target.value);
                  setSaveError("");
                  setSaveMessage("");
                }}
                rows={8}
                placeholder="Enter one pincode per line or paste comma-separated values"
                className="w-full rounded border border-gray-300 px-4 py-2"
              />
              <p className="mt-2 text-sm text-gray-500">
                Leave this empty to allow orders from all pincodes.
              </p>
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">
                Bulk Import Pincodes
              </label>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handlePincodeFileImport}
                className="w-full rounded border border-gray-300 px-4 py-2"
              />
              <p className="mt-2 text-sm text-gray-500">
                Upload a CSV or TXT file. We will import every valid 6-digit pincode found in the file.
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Active serviceable pincodes: {form.serviceablePincodes.length}
            </div>
            {saveError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {saveError}
              </div>
            ) : null}
            {saveMessage ? (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {saveMessage}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={saving}
              className="rounded bg-purple-700 px-5 py-2 font-semibold text-white hover:bg-purple-800 disabled:bg-gray-400"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
    </AdminShell>
  );
}
