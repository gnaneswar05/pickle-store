"use client";

import PageLoader from "@/app/components/PageLoader";
import { useAuth, useCart } from "@/app/store/useStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    contact: string;
  };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: string, callback: (response: unknown) => void) => void;
};

interface AppWindow extends Window {
  Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
}

interface TaxItem {
  _id: string;
  name: string;
  rate: number;
  isActive: boolean;
}

export default function CheckoutPage() {
  const { isAuthenticated } = useAuth();
  const { items, getTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [couponError, setCouponError] = useState("");
  const [taxes, setTaxes] = useState<TaxItem[]>([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [codLimit, setCodLimit] = useState(250);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentType, setPaymentType] = useState<"COD" | "ONLINE">("COD");

  const total = getTotal();
  const taxableAmount = Math.max(total - discountAmount, 0);
  const activeTaxes = taxes.filter((tax) => tax.isActive);
  const taxBreakdown = activeTaxes.map((tax) => ({
    ...tax,
    amount: Math.round(((taxableAmount * tax.rate) / 100) * 100) / 100,
  }));
  const finalTotal =
    Math.round(
      (taxableAmount +
        taxBreakdown.reduce((sum, tax) => sum + tax.amount, 0) +
        deliveryCharge) *
        100,
    ) / 100;

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchTaxSettings = async () => {
      try {
        const res = await fetch("/api/taxes");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load tax settings");
        }

        setTaxes(data.data.taxes || []);
        setDeliveryCharge(data.data.deliveryCharge || 0);
        setCodLimit(data.data.codLimit || 250);
      } catch (error) {
        console.error("Error fetching tax settings:", error);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchTaxSettings();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      const res = await fetch(`/api/coupons?code=${couponCode}`);
      const data = await res.json();

      if (!res.ok) {
        setCouponError(data.error || "Invalid coupon");
        return;
      }

      const coupon = data.data.coupon;
      let discount = 0;

      if (coupon.discountType === "PERCENTAGE") {
        discount = (total * coupon.discountValue) / 100;
      } else {
        discount = coupon.discountValue;
      }

      setDiscountAmount(discount);
      setCouponError("");
      setFormError("");
    } catch (err) {
      console.error(err);
      setCouponError("Failed to apply coupon");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Window is undefined"));
        return;
      }

      if ((window as AppWindow).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () =>
        reject(new Error("Razorpay script failed to load"));
      document.body.appendChild(script);
    });
  };

  const initiateRazorpayPayment = async () => {
    const createOrderRes = await fetch("/api/payments/razorpay/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items,
        address: formData,
        couponCode: couponCode || undefined,
      }),
    });

    const createOrderData = await createOrderRes.json();

    if (!createOrderRes.ok) {
      throw new Error(
        createOrderData.error || "Failed to create payment order",
      );
    }

    const razorpayOrder = createOrderData.data.razorpayOrder;
    const keyId = createOrderData.data.keyId;

    if (!keyId) {
      throw new Error("Razorpay key is missing. Check server environment.");
    }

    const options: RazorpayOptions = {
      key: keyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Kanvi Homemade Pickles",
      description: "Order payment",
      order_id: razorpayOrder.id,
      prefill: {
        name: formData.name,
        contact: formData.phone,
      },
      handler: async function (response) {
        const verifyRes = await fetch("/api/payments/razorpay/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("kanvi-token")}`,
          },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            items,
            address: formData,
            couponCode: couponCode || undefined,
          }),
        });

        const verifyData = await verifyRes.json();

        if (!verifyRes.ok) {
          setFormError(verifyData.error || "Payment verification failed");
          setLoading(false);
          return;
        }

        clearCart();
        router.push(`/order-confirmation/${verifyData.data.order._id}`);
      },
      theme: {
        color: "#0f766e",
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
          setFormError("Payment window was closed. You can choose another option.");
        },
      },
    };

    const Razorpay = (window as AppWindow).Razorpay;
    if (!Razorpay) {
      throw new Error("Razorpay SDK not loaded");
    }

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", (response: unknown) => {
      const msg =
        typeof response === "object" && response !== null && "error" in response
          ? (response as { error?: { description?: string } }).error
              ?.description
          : undefined;
      setFormError(msg || "Payment failed. Please try again.");
      setLoading(false);
    });
    rzp.open();
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.pincode
    ) {
      setFormError("Please fill all fields");
      return;
    }

    if (paymentType === "COD" && finalTotal >= codLimit) {
      setFormError(`COD not available for orders above Rs. ${codLimit}`);
      setPaymentType("ONLINE");
      return;
    }

    setFormError("");
    setLoading(true);

    try {
      if (paymentType === "ONLINE") {
        await loadRazorpayScript();
        await initiateRazorpayPayment();
        return;
      } else {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("kanvi-token")}`,
          },
          body: JSON.stringify({
            items,
            address: formData,
            paymentType,
            couponCode: couponCode || undefined,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setFormError(data.error || "Failed to place order");
          setLoading(false);
          return;
        }

        clearCart();
        router.push(`/order-confirmation/${data.data.order._id}`);
      }
    } catch (err) {
      console.error(err);
      setFormError((err as Error).message || "Something went wrong");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Your cart is empty</p>
      </div>
    );
  }

  if (settingsLoading) {
    return (
      <PageLoader
        label="Preparing Checkout"
        detail="We are loading taxes, delivery charges, and payment settings."
      />
    );
  }

  return (
    <div>
      {loading ? (
        <div className="fixed inset-0 z-50 bg-[rgba(45,27,18,0.22)] p-5 backdrop-blur-sm">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-center">
            <PageLoader
              compact
              label="Processing Order"
              detail="Please wait while we complete your payment or place your order."
            />
          </div>
        </div>
      ) : null}
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Address Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength={10}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    maxLength={6}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Type Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Payment Method</h2>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="COD"
                    checked={paymentType === "COD"}
                    onChange={(e) =>
                      setPaymentType(e.target.value as "COD" | "ONLINE")
                    }
                    disabled={finalTotal >= codLimit}
                    className="mr-2"
                  />
                  <span className={finalTotal >= codLimit ? "text-gray-400" : ""}>
                    Cash on Delivery{" "}
                    {finalTotal >= codLimit
                      ? `(Not available for orders above Rs. ${codLimit})`
                      : ""}
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    value="ONLINE"
                    checked={paymentType === "ONLINE"}
                    onChange={(e) =>
                      setPaymentType(e.target.value as "COD" | "ONLINE")
                    }
                    className="mr-2"
                  />
                  <span>Online Payment</span>
                </label>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || settingsLoading}
              className="w-full bg-purple-700 text-white py-3 rounded font-bold hover:bg-purple-800 disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Taxable Value</span>
              <span>₹{taxableAmount.toFixed(2)}</span>
            </div>

            {taxBreakdown.map((tax) => (
              <div key={tax._id} className="flex justify-between text-sm">
                <span>
                  {tax.name} ({tax.rate}%)
                </span>
                <span>₹{tax.amount.toFixed(2)}</span>
              </div>
            ))}

            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>₹{deliveryCharge.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
          {/* Coupon Input */}
          <div className="space-y-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
                if (couponError) {
                  setCouponError("");
                }
              }}
              placeholder="Enter coupon code"
              className={`w-full px-3 py-2 border rounded focus:outline-none text-sm ${
                couponError
                  ? "border-red-400 bg-red-50 focus:border-red-500"
                  : "border-gray-300 focus:border-purple-500"
              }`}
            />
            {couponError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {couponError}
              </div>
            ) : null}
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 text-sm"
            >
              Apply Coupon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
