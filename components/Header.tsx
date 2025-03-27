"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const pathName = usePathname();
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="Log" width="40" height="40" />
      </Link>
      <ul className="flex flex-row items-center gap-8">
        <Link
          href="/library"
          className={cn(
            "text-base cursor-pointer capitalize",
            pathName == "/library" ? "text-light-200" : "text-light-100",
          )}
        >
          Library
        </Link>
        <li>
          <Link href={"/my-profile"}>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
        </li>
      </ul>
    </header>
  );
};
export default Header;
