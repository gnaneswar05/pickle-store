import { getSiteSettings } from "@/lib/utils/site-settings";
import connectDB from "@/lib/db";

export const metadata = {
  title: "Refund Policy | Kanvi Pickles",
};

export const dynamic = "force-dynamic";

export default async function RefundPolicyPage() {
  await connectDB();
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">Legal</p>
      <h1 className="mb-10 border-b border-gray-200 pb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
        Refund Policy
      </h1>
      <div className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700">
        {settings.refundPolicy || "No refund policy provided yet."}
      </div>
    </div>
  );
}
