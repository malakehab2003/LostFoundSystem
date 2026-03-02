// src/utils/validation.ts

export const validateEmail = (email: string) => {
  if (!email || email.trim() === "") {
    return { valid: false, error: "Email is required" };
  }

  const regex =
    /^[^\s@]+@(gmail|yahoo|outlook|email)\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;

  if (!regex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }

  return { valid: true };
};

export const validateName = (name: string) => {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" };
  }
  return { valid: true };
};

// You can add other frontend-safe validations here
export const validatePhone = (phone: string) => {
  if (!phone) return { valid: true }; // optional
  const regex = /^(\+2)?01[0125][0-9]{8}$/;
  if (!regex.test(phone))
    return { valid: false, error: "Invalid phone number" };
  return { valid: true };
};
