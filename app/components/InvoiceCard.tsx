import FallbackImage from "@/app/components/FallbackImage";

interface InvoiceOrder {
  _id: string;
  invoiceNumber?: string;
  items: Array<{ productId: string; name: string; quantity: number; price: number }>;
  subtotalAmount?: number;
  taxableAmount?: number;
  totalTaxAmount?: number;
  taxes?: Array<{ name: string; rate: number; amount: number }>;
  deliveryCharge?: number;
  totalAmount: number;
  discountAmount?: number;
  paymentType: "COD" | "ONLINE";
  status: string;
  shipperName?: string | null;
  createdAt: string;
  address: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
  };
}

interface SiteSettings {
  brandName?: string;
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
}

interface InvoiceCardProps {
  order: InvoiceOrder;
  title?: string;
  onPrint?: () => void;
  siteSettings?: SiteSettings;
}

export default function InvoiceCard({
  order,
  title = "Invoice",
  onPrint,
  siteSettings,
}: InvoiceCardProps) {
  const subtotalAmount =
    order.subtotalAmount ??
    order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = order.discountAmount ?? 0;
  const taxableAmount = order.taxableAmount ?? subtotalAmount - discountAmount;
  const taxes = order.taxes ?? [];
  const deliveryCharge = order.deliveryCharge ?? 0;
  const totalTaxAmount =
    order.totalTaxAmount ??
    taxes.reduce((sum, tax) => sum + tax.amount, 0);
  const manufacturerAddress = [
    siteSettings?.manufacturerAddressLine1,
    siteSettings?.manufacturerAddressLine2,
    [siteSettings?.manufacturerCity, siteSettings?.manufacturerState]
      .filter(Boolean)
      .join(", "),
    siteSettings?.manufacturerPincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="rounded-[30px] border border-[var(--line,rgba(120,53,15,0.12))] bg-white p-6 print:rounded-none print:border-none print:shadow-none">
      <div className="flex flex-col gap-6 border-b border-[var(--line,rgba(120,53,15,0.12))] pb-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4">
          <FallbackImage
            src={siteSettings?.logoUrl || "/logo.jpeg"}
            alt={`${siteSettings?.brandName || "Kanvi"} logo`}
            width={72}
            height={72}
            className="rounded-2xl border border-[var(--line)] object-cover"
            fallbackSrc="/logo.jpeg"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand,#9a3412)]">
              {siteSettings?.brandName || "Kanvi"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-deep,#7c2d12)]">
              {order.invoiceNumber || `INV-${order._id.slice(-8).toUpperCase()}`}
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-stone-600 md:items-end">
          <span>Status: {order.status}</span>
          <span>Payment: {order.paymentType}</span>
          {onPrint ? (
            <button
              type="button"
              onClick={onPrint}
              className="rounded-full bg-[var(--brand,#9a3412)] px-4 py-2 text-sm font-semibold text-white print:hidden"
            >
              Print Invoice
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-[var(--surface,#fff7ed)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            {title}
          </p>
          <h3 className="mt-3 text-lg font-semibold text-[var(--brand-deep,#7c2d12)]">
            Manufacturer / Seller
          </h3>
          <div className="mt-3 space-y-1 text-sm leading-6 text-stone-700">
            <p>{siteSettings?.manufacturerName || siteSettings?.brandName || "Kanvi"}</p>
            {manufacturerAddress ? <p>{manufacturerAddress}</p> : null}
            {siteSettings?.manufacturerPhone ? (
              <p>Phone: {siteSettings.manufacturerPhone}</p>
            ) : null}
            {siteSettings?.manufacturerEmail ? (
              <p>Email: {siteSettings.manufacturerEmail}</p>
            ) : null}
            {siteSettings?.manufacturerGstin ? (
              <p>GSTIN: {siteSettings.manufacturerGstin}</p>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--surface,#fff7ed)] p-5">
          <h3 className="text-lg font-semibold text-[var(--brand-deep,#7c2d12)]">
            Shipping Address
          </h3>
          <div className="mt-3 space-y-1 text-sm leading-6 text-stone-700">
            <p>{order.address.name}</p>
            <p>{order.address.phone}</p>
            <p>{order.address.address}</p>
            <p>{order.address.pincode}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
            Items
          </h3>
          <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--line)]">
            <table className="w-full">
              <thead className="bg-[var(--surface,#fff7ed)] text-left text-sm text-stone-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Item</th>
                  <th className="px-4 py-3 font-semibold">Qty</th>
                  <th className="px-4 py-3 font-semibold">Rate</th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={`${item.productId}-${item.name}`}
                    className="border-t border-[var(--line)] text-sm text-stone-700"
                  >
                    <td className="px-4 py-3 font-medium text-stone-900">{item.name}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">Rs. {item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-[var(--brand-deep,#7c2d12)]">
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
            Summary
          </h3>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-white p-5">
            <div className="space-y-3 text-sm text-stone-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotalAmount.toFixed(2)}</span>
              </div>
              {discountAmount > 0 ? (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span>- Rs. {discountAmount.toFixed(2)}</span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span>Taxable Value</span>
                <span>Rs. {taxableAmount.toFixed(2)}</span>
              </div>
              {taxes.map((tax) => (
                <div key={`${tax.name}-${tax.rate}`} className="flex justify-between">
                  <span>
                    {tax.name} ({tax.rate}%)
                  </span>
                  <span>Rs. {tax.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between">
                <span>Total Tax</span>
                <span>Rs. {totalTaxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>Rs. {deliveryCharge.toFixed(2)}</span>
              </div>
              {order.shipperName ? (
                <div className="flex justify-between">
                  <span>Shipped By</span>
                  <span>{order.shipperName}</span>
                </div>
              ) : null}
            </div>
            <div className="mt-5 border-t border-[var(--line,rgba(120,53,15,0.12))] pt-4 text-lg font-semibold text-[var(--brand-deep,#7c2d12)]">
              Grand Total: Rs. {order.totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
