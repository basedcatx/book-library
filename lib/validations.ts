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

export const bookSchema = z.object({
  title: z.string().trim().min(2).max(100),
  author: z.string().trim().min(2).max(30),
  genre: z.string().trim().min(2).max(50),
  description: z.string().trim().min(10).max(1000),
  rating: z.coerce.number().min(1).max(5),
  totalCopies: z.coerce.number().int().positive().lte(10000),
  coverUrl: z.string().nonempty(),
  videoUrl: z.string().trim().nonempty(),
  coverColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-F]{6}$/i),
  summary: z.string().trim().min(10),
});

export const searchBookSchema = z.object({
  title: z.string().trim().nonempty("Book name cannot be empty"),
});
