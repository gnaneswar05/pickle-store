"use client";

import AdminImageField from "@/app/components/AdminImageField";
import AdminShell from "@/app/components/AdminShell";
import { parseServiceablePincodes } from "@/lib/utils/serviceable-pincodes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SiteSettingsForm {
  brandName: string;
  brandTagline: string;
  logoUrl: string;
  homeTrendingEyebrow: string;
  homeTrendingTitle: string;
  homeTrendingDescription: string;
  homeTrendingButtonLabel: string;
  homeSeasonalEyebrow: string;
  homeSeasonalTitle: string;
  homeSeasonalDescription: string;
  homeSeasonalButtonLabel: string;
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
  aboutUsTitle: string;
  aboutUsContent: string;
  aboutUsImage: string;
  termsAndConditions: string;
  privacyPolicy: string;
  refundPolicy: string;
}

const initialForm: SiteSettingsForm = {
  brandName: "",
  brandTagline: "",
  logoUrl: "",
  homeTrendingEyebrow: "",
  homeTrendingTitle: "",
  homeTrendingDescription: "",
  homeTrendingButtonLabel: "",
  homeSeasonalEyebrow: "",
  homeSeasonalTitle: "",
  homeSeasonalDescription: "",
  homeSeasonalButtonLabel: "",
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
  aboutUsTitle: "",
  aboutUsContent: "",
  aboutUsImage: "",
  termsAndConditions: "",
  privacyPolicy: "",
  refundPolicy: "",
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
          brandTagline: data.data.settings.brandTagline || "",
          logoUrl: data.data.settings.logoUrl || "",
          homeTrendingEyebrow: data.data.settings.homeTrendingEyebrow || "",
          homeTrendingTitle: data.data.settings.homeTrendingTitle || "",
          homeTrendingDescription:
            data.data.settings.homeTrendingDescription || "",
          homeTrendingButtonLabel:
            data.data.settings.homeTrendingButtonLabel || "",
          homeSeasonalEyebrow: data.data.settings.homeSeasonalEyebrow || "",
          homeSeasonalTitle: data.data.settings.homeSeasonalTitle || "",
          homeSeasonalDescription:
            data.data.settings.homeSeasonalDescription || "",
          homeSeasonalButtonLabel:
            data.data.settings.homeSeasonalButtonLabel || "",
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
          aboutUsTitle: data.data.settings.aboutUsTitle || "",
          aboutUsContent: data.data.settings.aboutUsContent || "",
          aboutUsImage: data.data.settings.aboutUsImage || "",
          termsAndConditions: data.data.settings.termsAndConditions || "",
          privacyPolicy: data.data.settings.privacyPolicy || "",
          refundPolicy: data.data.settings.refundPolicy || "",
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
              <label className="mb-2 block font-bold text-gray-700">Website Tagline</label>
              <input name="brandTagline" value={form.brandTagline} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Most Loved Label</label>
              <input name="homeTrendingEyebrow" value={form.homeTrendingEyebrow} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Most Loved Title</label>
              <input name="homeTrendingTitle" value={form.homeTrendingTitle} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Most Loved Description</label>
              <textarea name="homeTrendingDescription" value={form.homeTrendingDescription} onChange={handleChange} rows={4} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Most Loved Button</label>
              <input name="homeTrendingButtonLabel" value={form.homeTrendingButtonLabel} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <AdminImageField
              label="Brand Logo"
              value={form.logoUrl}
              onChange={(value) =>
                setForm((current) => ({ ...current, logoUrl: value }))
              }
              helperText="Select the logo you want to show across the website, admin, and invoices."
            />
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
            <div className="pt-4 border-t border-gray-200">
              <label className="mb-2 block font-bold text-gray-700">About Us Title</label>
              <input name="aboutUsTitle" value={form.aboutUsTitle} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">About Us Content</label>
              <textarea name="aboutUsContent" value={form.aboutUsContent} onChange={handleChange} rows={6} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <AdminImageField
              label="About Us Image"
              value={form.aboutUsImage}
              onChange={(value) =>
                setForm((current) => ({ ...current, aboutUsImage: value }))
              }
              helperText="Image displayed alongside the About Us story."
            />
          </div>

          <div className="space-y-6 rounded-xl border border-gray-200/50 bg-white p-6 shadow-sm">
            <div>
              <label className="mb-2 block font-bold text-gray-700">Address Line 1</label>
              <textarea name="manufacturerAddressLine1" value={form.manufacturerAddressLine1} onChange={handleChange} rows={3} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Seasonal Spotlight Label</label>
              <input name="homeSeasonalEyebrow" value={form.homeSeasonalEyebrow} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Seasonal Spotlight Title</label>
              <input name="homeSeasonalTitle" value={form.homeSeasonalTitle} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Seasonal Spotlight Description</label>
              <textarea name="homeSeasonalDescription" value={form.homeSeasonalDescription} onChange={handleChange} rows={4} className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Seasonal Spotlight Button</label>
              <input name="homeSeasonalButtonLabel" value={form.homeSeasonalButtonLabel} onChange={handleChange} className="w-full rounded border border-gray-300 px-4 py-2" />
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
            
            <div className="pt-6 border-t border-gray-200">
              <label className="mb-2 block font-bold text-gray-700">Terms & Conditions</label>
              <textarea name="termsAndConditions" value={form.termsAndConditions} onChange={handleChange} rows={6} placeholder="Enter your terms and conditions here..." className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Privacy Policy</label>
              <textarea name="privacyPolicy" value={form.privacyPolicy} onChange={handleChange} rows={6} placeholder="Enter your privacy policy here..." className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>
            <div>
              <label className="mb-2 block font-bold text-gray-700">Refund Policy</label>
              <textarea name="refundPolicy" value={form.refundPolicy} onChange={handleChange} rows={6} placeholder="Enter your refund policy here..." className="w-full rounded border border-gray-300 px-4 py-2" />
            </div>

            <div className="pt-6 border-t border-gray-200">
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
