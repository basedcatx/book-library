import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import BookOverview from "@/components/BookOverview";
import { auth } from "@/auth";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const bookId = (await params).id;
  const session = await auth();
  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, bookId))
    .limit(1);

  if (!bookDetails) redirect("/404");

  if (!session) return redirect("/sign-in");

  console.log("Book detail found", bookDetails);
  return (
    <>
      <BookOverview {...bookDetails} />
      <div className={"book-details"}>
        <div className={"flex-[1.5]"}>
          <section className={"mt-10 flex flex-col gap-7"}>
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
