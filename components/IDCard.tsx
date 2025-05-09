import React from "react";
import { Session } from "next-auth";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { redirect } from "next/navigation";
import { IdCardImage } from "@/components/IDCardImage";

interface Props {
  id: string;
  fullName: string;
  email: string;
  universityId: string;
  password: string;
  universityCard: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  role: "USER" | "ADMIN" | null;
  lastActivityDate: string;
  createdAt: Date | null;
}

const IdCard = async ({ session, user }: { session: Session; user: Props }) => {
  if (!session?.user?.id) return null;

  const currentUserAccount = user;
  if (!currentUserAccount) redirect("/sign-up");

  let currentStatus;

  switch (currentUserAccount.status) {
    case "APPROVED":
      currentStatus = 1;
      break;
    case "REJECTED":
      currentStatus = -1;
      break;
    default:
      currentStatus = 0;
  }

  return (
    <div
      className={
        "gradient-blue relative rounded-xl px-8 py-20 text-white font-ibm-plex-sans max-h-[600px] h-fit flex-shrink"
      }
    >
      {/*Floating thingy on the top*/}
      <div
        className={
          "absolute inset-x-0 -top-3 mx-auto flex h-16 w-10 items-end justify-center rounded-b-full rounded-t-sm bg-[#464f6f] px-1 py-2 shadow-md"
        }
      >
        <div
          className={"gradient-blue mx-1 h-2 w-[96px] rounded-full text-black"}
        >
          {" "}
        </div>
      </div>

      <div className={"flex items-center gap-4"}>
        <Avatar className={"w-[100px] h-[100px] bg-[#464f6f] "}>
          <AvatarImage src="https://placehold.co/150x150" />
          <AvatarFallback className={"bg-[#464f6f]"}>
            {getInitials(currentUserAccount.fullName)}
          </AvatarFallback>
        </Avatar>

        <div className={"flex flex-col gap-4"}>
          <div className={"flex gap-2"}>
            <Image
              src={
                currentStatus === 1
                  ? "/icons/verified.svg"
                  : "/icons/warning.svg"
              }
              alt={"Verified"}
              width={20}
              height={20}
            />
            {currentStatus === 1 && (
              <p className={"id-text-heading-color"}>Verified Student</p>
            )}
          </div>
          <p className={"text-xl font-semibold"}>{session?.user?.name}</p>
          <p className={"font-light id-text-heading-color"}>
            {session?.user?.email}
          </p>
        </div>
      </div>

      <div className={"mt-8 flex flex-col gap-8"}>
        <div className={"flex flex-col gap-2"}>
          <h3 className={"id-text-heading"}>University</h3>
          <p className={"id-text-item"}>Catholic University Institute</p>
        </div>

        <div className={"flex flex-col gap-2"}>
          <h3 className={"id-text-heading"}>Student ID</h3>
          <p className={"id-text-item"}>{currentUserAccount?.universityId}</p>
        </div>
      </div>

      {/* Student's ID */}
      <div className={"mt-6 border-0 rounded-md"}>
        <IdCardImage path={currentUserAccount.universityCard} />
      </div>
    </div>
  );
};
export default IdCard;
