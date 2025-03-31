import { serve } from "@upstash/workflow/nextjs";
import users from "@/database/schema";
import { db } from "@/database/drizzle";
import { SendEmail } from "@/lib/workflow";
import { eq } from "drizzle-orm";

type UserState = "non-active" | "active";

type InitialData = {
  email: string;
  fullName: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email: string): Promise<UserState> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) return "non-active";

  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const now = new Date();

  const timeDifference = now.getTime() - lastActivityDate.getTime();

  if (
    timeDifference > THREE_DAYS_IN_MS &&
    timeDifference <= THIRTY_DAYS_IN_MS
  ) {
    return "non-active";
  }

  return "active";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  await context.run("new-signup", async () => {
    await SendEmail({
      email,
      name: fullName,
      subject: "Welcome to the Book Library!",
      body: `Welcome ${fullName} to the Book Library, Make sure to check out our large collections, see you around!`,
    });
  });

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await SendEmail({
          email,
          name: fullName,
          subject: "Are you still there?",
          body: `Hey! ${fullName} we missed ya so much! Please find some time to pass by and check out some new landings!`,
        });
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await SendEmail({
          email,
          name: fullName,
          subject: "Welcome back!",
          body: `Welcome ${fullName} we are very glad you came back to us, good to see ya around!`,
        });
      });
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});
