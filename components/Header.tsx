import React from "react";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import users from "@/database/schema";
import { eq } from "drizzle-orm";
import AdminPageButton from "@/components/AdminPageButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const Header = async () => {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session?.user?.id))
    .limit(1);

  return (
    <header className="my-10 flex items-center justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="Log" width="40" height="40" />
      </Link>

      <div className="flex flex-row gap-6">
        <Link href={"/profile"} className={"flex items-center gap-2"}>
          <Avatar className={"my-2 size-[30px] bg-blue-200"}>
            <AvatarFallback className={"bg-blue-200"}>
              {getInitials(session?.user?.name || "IN")}
            </AvatarFallback>
          </Avatar>

          <p className={"font-bold tracking-wider text-light-100"}>
            {session?.user?.name?.split(" ")[0].toUpperCase()}
          </p>
        </Link>

        {user.role === "ADMIN" && <AdminPageButton />}

        <Link className={"my-2"} href={"/admin"}>
          <Image
            src={"/icons/logout.svg"}
            alt={"admin"}
            width={30}
            height={30}
          />
        </Link>
      </div>
    </header>
  );
};
export default Header;
