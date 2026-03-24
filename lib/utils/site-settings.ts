import SiteSetting from "@/lib/models/SiteSetting";

export async function getSiteSettings() {
  let settings = await SiteSetting.findOne();

  if (!settings) {
    settings = await SiteSetting.create({
      brandName: "Kanvi",
      logoUrl: "/logo.jpeg",
      manufacturerName: "Kanvi Homemade Pickles",
    });
  }

  return settings;
}
