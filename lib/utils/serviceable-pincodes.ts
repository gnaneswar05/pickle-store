import { validatePincode } from "@/lib/utils/validation";

export function normalizePincode(value: string): string {
  return value.trim().replace(/\D/g, "");
}

export function parseServiceablePincodes(input: unknown): string[] {
  const rawValues = Array.isArray(input)
    ? input.flatMap((value) =>
        typeof value === "string" ? value.split(/[\s,;]+/) : [],
      )
    : typeof input === "string"
      ? input.match(/\d{6}/g) ?? []
      : [];

  const uniquePincodes = Array.from(
    new Set(
      rawValues
        .map((value) => normalizePincode(value))
        .filter((value) => value.length > 0),
    ),
  );

  const invalidPincode = uniquePincodes.find(
    (pincode) => !validatePincode(pincode),
  );

  if (invalidPincode) {
    throw new Error(`Invalid serviceable pincode: ${invalidPincode}`);
  }

  return uniquePincodes.sort();
}

export function isPincodeServiceable(
  pincode: string,
  serviceablePincodes: string[],
): boolean {
  if (serviceablePincodes.length === 0) {
    return true;
  }

  return serviceablePincodes.includes(normalizePincode(pincode));
}
