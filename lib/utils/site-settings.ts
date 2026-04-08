import SiteSetting from "@/lib/models/SiteSetting";

export async function getSiteSettings() {
  let settings = await SiteSetting.findOne();

  if (!settings) {
    settings = await SiteSetting.create({
      brandName: "Kanvi",
      brandTagline: "Small Batch Pickles",
      logoUrl: "/logo.jpeg",
      homeTrendingEyebrow: "Most Loved",
      homeTrendingTitle: "Fan-favourite jars with a premium shelf feel",
      homeTrendingDescription:
        "This row is styled like a curated collection instead of a plain list, so customers get a more premium browse experience.",
      homeTrendingButtonLabel: "View all products",
      homeSeasonalEyebrow: "Seasonal Spotlight",
      homeSeasonalTitle: "Limited runs worth catching before they disappear",
      homeSeasonalDescription:
        "A softer editorial section that feels distinct from the main best-seller shelf while still keeping the premium rhythm.",
      homeSeasonalButtonLabel: "Browse collection",
      manufacturerName: "Kanvi Homemade Pickles",
      serviceablePincodes: [],
    });
  }

  return settings;
}
