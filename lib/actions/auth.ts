"use server";

import users from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthCredentials } from "@/types";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import config from "@/lib/config";
import { Client } from "@upstash/workflow";
import { workFlowClient } from "@/lib/workflow";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password" | "fullName">,
) => {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "localhost";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return redirect("/too-fast");
  }

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
  } catch (err: any) {
    console.error(err, "Automatic signIn with failed!");
    return {
      success: false,
      error: "Most likely invalid credentials! Check your email/password!",
    };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, password, universityId, universityCard } = params;

  const ip = (await headers()).get("x-forwarded-for") || "localhost";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return redirect("/too-fast");
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length * 1 > 0) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await workFlowClient.trigger({
      url: `${config.env.prodApiEndpoint!}/api/workflows/onboarding`,
      body: {
        email,
        fullName,
      },
    });

    await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      universityCard,
    });

    await signInWithCredentials({ email, password, fullName });

    return { success: true };
  } catch (error) {
    console.log(error, "Sign up failed!");
    return { success: false, error: "Sign up error! Please try again later!" };
  }
};
