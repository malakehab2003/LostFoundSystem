import z from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";

export const loginForm = z.object({
  email: z
    .string()
    .min(1, "Email  is required")
    .email("Invalid email address")
    .regex(
      /^[^\s@]+@(gmail|yahoo|outlook|email)\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
      "Email must be a valid address from gmail, yahoo, outlook, or email domains",
    ),
  password: z
    .string()
    .regex(/^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{7,}$/, {
      message: "Password must be at least 7 characters long",
    }),
});

export type LoginFormSchema = z.infer<typeof loginForm>;

export const SignupForm = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be at most 255 characters"),
  email: z
    .string()
    .min(1, "Email  is required")
    .email("Invalid email address")
    .regex(
      /^[^\s@]+@(gmail|yahoo|outlook|email)\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
      "Email must be a valid address from gmail, yahoo, outlook, or email domains",
    )
    .max(255, "Email  must be at most 255 characters"),
  gender: z
    .string()
    .min(1, "Gender is required")
    .refine(
      (val) => ["male", "female"].includes(val),
      "Gender must be a valid option",
    ),
  dob: z.date().refine(
    (date) => {
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 13,
        today.getMonth(),
        today.getDate(),
      );

      return date <= minDate;
    },
    {
      message: "You must be at least 13 years old and date must be in the past",
    },
  ),
  phone: z
    .string()
    .refine(
      (val) => val === "" || (isValidPhoneNumber(val) && val.startsWith("+20")),
      "Phone number must be a valid Egyptian number starting with +20",
    )
    .optional(),
  image_url: z.string().optional().or(z.literal("")),
  password: z
    .string()
    .regex(/^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{7,}$/, {
      message:
        "Password must be at least 7 characters long and include at least one number and one special character",
    }),
});

export type SignupFormSchema = z.infer<typeof SignupForm>;

export const UpdateProfileForm = SignupForm.partial();

export type UpdateProfileFormSchema = z.infer<typeof UpdateProfileForm>;
