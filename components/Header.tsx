import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="my-10 flex items-center justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="Log" width="40" height="40" />
      </Link>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button className={"my-2 bg-light-200 text-black hover:text-light-100"}>
          Logout
        </Button>
      </form>
    </header>
  );
};
export default Header;
