import { z } from "zod";
import { serviceKeys } from "@/content/services";
const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine(
      (v) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(v),
      "Please remove unsupported control characters.",
    );
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.")
  .max(254);
export const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters.")
  .max(128, "Use no more than 128 characters.");
export const profileSchema = z.object({
  name: text(100).pipe(z.string().min(2, "Enter your name.")),
  company: text(150).optional(),
  phone: text(40).optional(),
});
export const signupSchema = profileSchema
  .extend({
    email: emailSchema,
    password: passwordSchema,
    confirmation: z.string(),
  })
  .refine((v) => v.password === v.confirmation, {
    message: "Passwords must match.",
    path: ["confirmation"],
  });
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});
export const inquirySchema = z.object({
  name: text(100).pipe(z.string().min(2)),
  email: emailSchema,
  phone: text(40).optional(),
  service: z.enum(serviceKeys),
  message: text(5000).pipe(
    z.string().min(20, "Tell us a little more (at least 20 characters)."),
  ),
});
export const resetSchema = z
  .object({
    token: z.string().regex(/^[a-f0-9]{64}$/),
    password: passwordSchema,
    confirmation: z.string(),
  })
  .refine((v) => v.password === v.confirmation, {
    message: "Passwords must match.",
    path: ["confirmation"],
  });
export const adminInquirySchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "WAITING_ON_CLIENT", "CLOSED"]),
  note: text(3000).optional(),
});
