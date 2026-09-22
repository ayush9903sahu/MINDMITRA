import { z } from "zod";
import { PASSWORD_MIN_LENGTH } from "../../../shared/constants/auth.constants";

const emailSchema = z
  .string({ required_error: "Email is required." })
  .trim()
  .min(1, "Email is required.")
  .email("Enter a valid email address.");

const passwordSchema = z
  .string({ required_error: "Password is required." })
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`
  )
  .max(72, "Password must be 72 characters or fewer.")
  .refine((val) => /[a-zA-Z]/.test(val) && /[0-9]/.test(val), {
    message: "Password must include at least one letter and one number.",
  });

export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: z.string({
      required_error: "Please confirm your password.",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ required_error: "Password is required." }).min(1, "Password is required."),
});

/**
 * Converts a Zod error into the field-keyed shape used by ApiErrorResponse.
 */
export function zodErrorToFields(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!fields[key]) {
      fields[key] = issue.message;
    }
  }
  return fields;
}
