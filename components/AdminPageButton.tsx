import React from "react";
import Link from "next/link";
import Image from "next/image";

const AdminPageButton = () => {
  return (
    <Link className={"my-2"} href={"/admin"}>
      <Image
        src={"/icons/admin/admin.svg"}
        alt={"admin"}
        width={30}
        height={30}
      />
    </Link>
  );
};
export default AdminPageButton;
