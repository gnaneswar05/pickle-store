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
  title = "TAX INVOICE",
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
    <div className="print-region mx-auto w-full max-w-5xl overflow-hidden rounded-[20px] border border-gray-200 bg-white text-gray-900 shadow-sm print:m-0 print:border-none print:shadow-none print:!bg-white print:!text-black">
      
      {/* Header Section */}
      <div className="bg-gray-50 px-6 py-8 md:px-10 print:bg-transparent print:p-0 print:pb-6">
        <div className="flex flex-col-reverse justify-between gap-8 md:flex-row print:flex-row md:items-start print:items-start">
          <div className="flex items-start gap-4">
            <FallbackImage
              src={siteSettings?.logoUrl || "/logo.jpeg"}
              alt={`${siteSettings?.brandName || "Kanvi"} logo`}
              width={80}
              height={80}
              className="rounded-xl border border-gray-200 object-cover shadow-sm print:border-none print:shadow-none"
              fallbackSrc="/logo.jpeg"
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                {siteSettings?.brandName || "Kanvi"}
              </h1>
              {siteSettings?.manufacturerGstin && (
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  GSTIN: {siteSettings.manufacturerGstin}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end print:items-end">
            <h2 className="text-3xl font-black uppercase tracking-widest text-gray-300 print:text-gray-900">
              {title}
            </h2>
            <div className="mt-3 grid gap-1 text-sm text-gray-600 md:text-right print:text-right">
              <p>
                Invoice No: <span className="font-semibold text-gray-900">{order.invoiceNumber || `INV-${order._id.slice(-8).toUpperCase()}`}</span>
              </p>
              <p>
                Date: <span className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
              </p>
              <p>
                Order ID: <span className="font-semibold text-gray-900">{order._id}</span>
              </p>
            </div>
            {onPrint && order.status === "DELIVERED" && (
              <button
                type="button"
                onClick={onPrint}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 print:hidden"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Invoice
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Address Block */}
      <div className="grid grid-cols-1 gap-8 border-b border-gray-100 px-6 py-8 text-sm md:grid-cols-2 print:grid-cols-2 md:px-10 print:px-0 print:py-6">
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Billed By (Manufacturer)
          </h3>
          <div className="space-y-1.5 leading-relaxed text-gray-600">
            <p className="font-semibold text-gray-900">{siteSettings?.manufacturerName || siteSettings?.brandName || "Kanvi"}</p>
            {manufacturerAddress ? <p>{manufacturerAddress}</p> : null}
            {siteSettings?.manufacturerPhone && <p>Phone: {siteSettings.manufacturerPhone}</p>}
            {siteSettings?.manufacturerEmail && <p>Email: {siteSettings.manufacturerEmail}</p>}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            Billed To (Customer)
          </h3>
          <div className="space-y-1.5 leading-relaxed text-gray-600">
            <p className="font-semibold text-gray-900">{order.address.name}</p>
            <p>{order.address.phone}</p>
            <p className="max-w-[280px]">{order.address.address}</p>
            <p>Pincode: {order.address.pincode}</p>
          </div>
        </div>
      </div>

      {/* Order Info Bar */}
      <div className="flex flex-wrap items-center gap-6 border-b border-gray-100 bg-gray-50/50 px-6 py-4 text-sm md:px-10 print:flex-nowrap print:px-0 print:py-3">
        <div>
          <span className="text-gray-500">Payment Method:</span>{" "}
          <span className="font-medium text-gray-900">{order.paymentType}</span>
        </div>
        <div>
          <span className="text-gray-500">Order Status:</span>{" "}
          <span className="font-medium text-gray-900">{order.status}</span>
        </div>
        {order.shipperName && (
          <div>
            <span className="text-gray-500">Shipper:</span>{" "}
            <span className="font-medium text-gray-900">{order.shipperName}</span>
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="px-6 py-8 md:px-10 print:px-0 print:py-6 relative w-full overflow-x-auto print:overflow-visible">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b-2 border-gray-900 text-gray-900">
              <th className="py-3 pr-4 font-bold">Item Description</th>
              <th className="px-4 py-3 text-center font-bold">Quantity</th>
              <th className="px-4 py-3 text-right font-bold">Rate</th>
              <th className="py-3 pl-4 text-right font-bold">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <tr key={`${item.productId}-${item.name}`} className="text-gray-700">
                <td className="py-4 pr-4">
                  <p className="font-medium text-gray-900">{item.name}</p>
                </td>
                <td className="px-4 py-4 text-center">{item.quantity}</td>
                <td className="px-4 py-4 text-right">Rs. {item.price.toFixed(2)}</td>
                <td className="py-4 pl-4 text-right font-medium text-gray-900">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="bg-gray-50 px-6 py-8 md:px-10 print:bg-transparent print:px-0 print:py-6">
        <div className="flex flex-col md:flex-row md:justify-end">
          <div className="w-full space-y-3 text-sm md:w-80">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">Rs. {subtotalAmount.toFixed(2)}</span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-medium">- Rs. {discountAmount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-gray-600">
              <span>Taxable Value</span>
              <span className="font-medium text-gray-900">Rs. {taxableAmount.toFixed(2)}</span>
            </div>

            {taxes.map((tax) => (
              <div key={`${tax.name}-${tax.rate}`} className="flex justify-between text-gray-600">
                <span>{tax.name} ({tax.rate}%)</span>
                <span className="font-medium text-gray-900">Rs. {tax.amount.toFixed(2)}</span>
              </div>
            ))}
            
            <div className="flex justify-between border-t border-gray-200 pt-3 text-gray-600">
              <span>Total Tax</span>
              <span className="font-medium text-gray-900">Rs. {totalTaxAmount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge</span>
              <span className="font-medium text-gray-900">Rs. {deliveryCharge.toFixed(2)}</span>
            </div>

            <div className="mt-4 flex justify-between border-t-2 border-gray-900 pt-4 text-lg font-bold text-gray-900">
              <span>Grand Total</span>
              <span>Rs. {order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="bg-white px-6 py-6 text-center text-xs text-gray-400 md:px-10 print:px-0 print:py-4">
        Thank you for trusting {siteSettings?.brandName || "Kanvi"}. This is a computer-generated invoice and requires no signature.
      </div>
    </div>
  );
}
