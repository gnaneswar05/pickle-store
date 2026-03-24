import TaxSetting, { ITaxRate } from "@/lib/models/TaxSetting";

export interface PriceInputItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface AppliedTax {
  name: string;
  rate: number;
  amount: number;
}

export interface PricingBreakdown {
  subtotalAmount: number;
  discountAmount: number;
  taxableAmount: number;
  taxes: AppliedTax[];
  totalTaxAmount: number;
  deliveryCharge: number;
  totalAmount: number;
}

export function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

export function calculateSubtotal(items: PriceInputItem[]) {
  return roundCurrency(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
}

export async function getTaxSettings() {
  let settings = await TaxSetting.findOne();

  if (!settings) {
    settings = await TaxSetting.create({
      taxes: [],
      deliveryCharge: 0,
      codLimit: 250,
    });
  }

  return settings;
}

export function calculatePricingBreakdown(args: {
  items: PriceInputItem[];
  discountAmount?: number;
  taxes?: ITaxRate[];
  deliveryCharge?: number;
}) {
  const subtotalAmount = calculateSubtotal(args.items);
  const safeDiscount = roundCurrency(
    Math.min(Math.max(args.discountAmount ?? 0, 0), subtotalAmount),
  );
  const taxableAmount = roundCurrency(subtotalAmount - safeDiscount);
  const activeTaxes = (args.taxes ?? []).filter((tax) => tax.isActive);
  const taxes = activeTaxes.map((tax) => ({
    name: tax.name,
    rate: tax.rate,
    amount: roundCurrency((taxableAmount * tax.rate) / 100),
  }));
  const totalTaxAmount = roundCurrency(
    taxes.reduce((sum, tax) => sum + tax.amount, 0),
  );
  const deliveryCharge = roundCurrency(Math.max(args.deliveryCharge ?? 0, 0));
  const totalAmount = roundCurrency(
    taxableAmount + totalTaxAmount + deliveryCharge,
  );

  return {
    subtotalAmount,
    discountAmount: safeDiscount,
    taxableAmount,
    taxes,
    totalTaxAmount,
    deliveryCharge,
    totalAmount,
  } satisfies PricingBreakdown;
}

export function buildInvoiceNumber(orderId: string) {
  return `INV-${orderId.slice(-8).toUpperCase()}`;
}
