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
  createdAt: string;
  address: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
  };
}

interface InvoiceCardProps {
  order: InvoiceOrder;
  title?: string;
  onPrint?: () => void;
}

export default function InvoiceCard({
  order,
  title = "Invoice",
  onPrint,
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

  return (
    <section className="rounded-[30px] border border-[var(--line,rgba(120,53,15,0.12))] bg-white p-6">
      <div className="flex flex-col gap-4 border-b border-[var(--line,rgba(120,53,15,0.12))] pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand,#9a3412)]">
            {title}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--brand-deep,#7c2d12)]">
            {order.invoiceNumber || `INV-${order._id.slice(-8).toUpperCase()}`}
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-stone-600 md:items-end">
          <span>Status: {order.status}</span>
          <span>Payment: {order.paymentType}</span>
          {onPrint ? (
            <button
              type="button"
              onClick={onPrint}
              className="rounded-full bg-[var(--brand,#9a3412)] px-4 py-2 text-sm font-semibold text-white"
            >
              Print Invoice
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
            Items
          </h3>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div
                key={`${item.productId}-${item.name}`}
                className="rounded-2xl bg-[var(--surface,#fff7ed)] px-4 py-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-stone-900">{item.name}</p>
                    <p className="text-sm text-stone-500">
                      Qty {item.quantity} x Rs. {item.price}
                    </p>
                  </div>
                  <p className="font-semibold text-[var(--brand-deep,#7c2d12)]">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Bill To
            </h3>
            <div className="mt-4 space-y-1 text-sm leading-6 text-stone-700">
              <p>{order.address.name}</p>
              <p>{order.address.phone}</p>
              <p>{order.address.address}</p>
              <p>{order.address.pincode}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
              Summary
            </h3>
            <div className="mt-4 space-y-3 text-sm text-stone-700">
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
