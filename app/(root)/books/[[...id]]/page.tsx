import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import BookOverview from "@/components/BookOverview";
import { auth } from "@/auth";
import config from "@/lib/config";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const bookId = (await params).id;

  if (!bookId || bookId.length < 1 || bookId[0].length < 1) {
    redirect("/");
  }

  const session = await auth();
  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, bookId[0]))
    .limit(1);

  if (!bookDetails) redirect("/404");

  if (!session) return redirect("/sign-in");
  if (!session?.user?.id) return redirect("/sign-in");

  console.log("Book detail found", bookDetails);
  return (
    <>
      <BookOverview
        {...bookDetails}
        id={bookId[0]}
        userid={session?.user?.id}
      />
      <div className={"book-details"}>
        <div className={"flex-[1.5]"}>
          <section className={"mt-10 flex flex-col gap-7"}>
            <div>
              <video
                preload={"metadata"}
                className={"w-full"}
                playsInline
                autoPlay
                loop
              >
                <source
                  src={`${config.env.imagekit.urlEndpoint}/${bookDetails.videoUrl}`}
                />
              </video>
            </div>
            <h3>Summary</h3>
            <div className={"space-y-5 text-xl text-light-100"}>
              {bookDetails.summary
                .split("\n")
                .map((line: string, i: number) => (
                  <p key={i}>{line}</p>
                ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
export default Page;
