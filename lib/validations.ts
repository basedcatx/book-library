import { z } from "zod";

export const signupScheme = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  universityId: z.string().min(5).nonempty("University ID/MAT is required!"),
  universityCard: z.string().nonempty("University card is required"),
  password: z.string().min(8).max(256),
});
export const signInScheme = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(256),
});
