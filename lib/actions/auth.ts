"use server";

import users from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthCredentials } from "@/types";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const { email, password } = params;
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      return { success: false, error: res?.error };
    }

    return { success: true };
  } catch (err) {
    console.error(err, "Automatic signIn with failed!");
    return { success: false, error: "Sign in error!" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, password, universityId, universityCard } = params;
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      universityCard,
    });

    await signInWithCredentials({ email, password });
    return { success: true };
  } catch (error) {
    console.log(error, "Sign up failed!");
    return { success: false, error: "Sign up error!" };
  }
};
