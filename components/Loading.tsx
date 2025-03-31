import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const Loading = ({ isHidden = false }: { isHidden: boolean }) => {
  return (
    <div>
      <Image
        src={"/assets/loading.svg"}
        alt={"Loading"}
        width={20}
        height={20}
        className={cn(isHidden && "hidden", "animate-spin duration-200")}
      />
    </div>
  );
};
export default Loading;
