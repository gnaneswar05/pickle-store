"use client";

import { useEffect, useState } from "react";

interface SiteSettingsResponse {
  brandName?: string;
  brandTagline?: string;
  logoUrl?: string;
  manufacturerName?: string;
  manufacturerPhone?: string;
  manufacturerEmail?: string;
  manufacturerGstin?: string;
  manufacturerAddressLine1?: string;
  manufacturerAddressLine2?: string;
  manufacturerCity?: string;
  manufacturerState?: string;
  manufacturerPincode?: string;
  aboutUsTitle?: string;
  aboutUsContent?: string;
  aboutUsImage?: string;
  termsAndConditions?: string;
  privacyPolicy?: string;
  refundPolicy?: string;
  homeTrendingEyebrow?: string;
}

const defaultSettings: Required<SiteSettingsResponse> = {
  brandName: "Kanvi",
  brandTagline: "Small Batch Pickles",
  logoUrl: "/logo.jpeg",
  manufacturerName: "Kanvi Pickles",
  manufacturerPhone: "",
  manufacturerEmail: "hello@kanvi.com",
  manufacturerGstin: "",
  manufacturerAddressLine1: "",
  manufacturerAddressLine2: "",
  manufacturerCity: "",
  manufacturerState: "",
  manufacturerPincode: "",
  aboutUsTitle: "Who We Are",
  aboutUsContent: "We make small-batch pickles with real spice, real oil, and no factory feel.",
  aboutUsImage: "/logo.jpeg",
  termsAndConditions: "Terms and conditions go here.",
  privacyPolicy: "Privacy policy goes here.",
  refundPolicy: "Refund policy goes here.",
  homeTrendingEyebrow: "Most Loved",
};

export default function useSiteSettings() {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const controller = new AbortController();

    const loadSettings = async () => {
      try {
        const response = await fetch("/api/site-settings", {
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        const data = payload?.data?.settings ?? payload?.data ?? {};

        setSettings({
          brandName: data.brandName || defaultSettings.brandName,
          brandTagline: data.brandTagline || defaultSettings.brandTagline,
          logoUrl: data.logoUrl || defaultSettings.logoUrl,
          manufacturerName: data.manufacturerName || defaultSettings.manufacturerName,
          manufacturerPhone: data.manufacturerPhone || defaultSettings.manufacturerPhone,
          manufacturerEmail: data.manufacturerEmail || defaultSettings.manufacturerEmail,
          manufacturerGstin: data.manufacturerGstin || defaultSettings.manufacturerGstin,
          manufacturerAddressLine1: data.manufacturerAddressLine1 || defaultSettings.manufacturerAddressLine1,
          manufacturerAddressLine2: data.manufacturerAddressLine2 || defaultSettings.manufacturerAddressLine2,
          manufacturerCity: data.manufacturerCity || defaultSettings.manufacturerCity,
          manufacturerState: data.manufacturerState || defaultSettings.manufacturerState,
          manufacturerPincode: data.manufacturerPincode || defaultSettings.manufacturerPincode,
          aboutUsTitle: data.aboutUsTitle || defaultSettings.aboutUsTitle,
          aboutUsContent: data.aboutUsContent || defaultSettings.aboutUsContent,
          aboutUsImage: data.aboutUsImage || defaultSettings.aboutUsImage,
          termsAndConditions: data.termsAndConditions || defaultSettings.termsAndConditions,
          privacyPolicy: data.privacyPolicy || defaultSettings.privacyPolicy,
          refundPolicy: data.refundPolicy || defaultSettings.refundPolicy,
          homeTrendingEyebrow: data.homeTrendingEyebrow || defaultSettings.homeTrendingEyebrow,
        });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
      }
    };

    loadSettings();

    return () => controller.abort();
  }, []);

  return settings;
}
