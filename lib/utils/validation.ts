export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePincode(pincode: string): boolean {
  const pincodeRegex = /^[0-9]{6}$/;
  return pincodeRegex.test(pincode);
}

export function calculateDiscount(
  originalPrice: number,
  discountType: "PERCENTAGE" | "FIXED",
  discountValue: number,
): number {
  if (discountType === "PERCENTAGE") {
    return (originalPrice * discountValue) / 100;
  }
  return discountValue;
}
