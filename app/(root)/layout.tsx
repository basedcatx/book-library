import React from "react";
import Header from "@/components/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import users from "@/database/schema";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  if (!session?.user?.id) return;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session?.user?.id))
    .limit(1);

  after(async () => {
    // get the user and see if the last activity date is today!

    if (user.lastActivityDate! === new Date().toISOString().slice(0, 10))
      return;

    if (!session?.user?.id) return;

    await db
      .update(users)
      .set({
        lastActivityDate: new Date().toISOString().slice(0, 10),
      })
      .where(eq(users.id, session?.user?.id));
  });

  return (
    <main className="root-container mx-auto dark">
      <div className="max-w-7xl">
        <Header role={user.role || "USER"} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};
export default Layout;
