import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(4, "Password is required"),
});
