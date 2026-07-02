import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({ message: "Provide a valid infrastructure admin email address." }),
  password: z.string().min(6, { message: "Security configurations require at least 6 characters." }),
});

export const RegisterSchema = z
  .object({
    businessName: z.string().min(3, { message: "Corporate entity identifier must be at least 3 characters." }),
    email: z.email({ message: "Provide a valid company communication endpoint." }),
    password: z.string().min(6, { message: "Security credentials must be at least 6 characters." }),
    phone: z.string().min(10, { message: "Provide a valid contact number for your organization." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Security hashes do not replicate.",
    path: ["confirmPassword"],
  });

export type LoginFields = z.infer<typeof LoginSchema>;
export type RegisterFields = z.infer<typeof RegisterSchema>;
