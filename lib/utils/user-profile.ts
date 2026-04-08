import { validateEmail } from "@/lib/utils/validation";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isProfileComplete(user: {
  name?: string | null;
  gender?: string | null;
  email?: string | null;
}) {
  return Boolean(
    user.name?.trim() &&
      user.gender &&
      user.gender !== "" &&
      user.email?.trim(),
  );
}

export function validateProfileInput(input: {
  name?: string;
  gender?: string;
  email?: string;
}) {
  const name = input.name?.trim() || "";
  const gender = input.gender?.trim() || "";
  const email = normalizeEmail(input.email || "");

  if (!name) {
    return { error: "Name is required" };
  }

  if (!["male", "female", "other"].includes(gender)) {
    return { error: "Gender is required" };
  }

  if (!email || !validateEmail(email)) {
    return { error: "Valid email is required" };
  }

  return {
    name,
    gender: gender as "male" | "female" | "other",
    email,
  };
}
