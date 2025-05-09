import IdCard from "@/components/IDCard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BorrowBookCard from "@/components/BorrowBookCard";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import users, { books, borrowRecords } from "@/database/schema";
import Image from "next/image";

const Page = async () => {
  const session = await auth();

  if (!session || !session?.user?.id) {
    redirect("/sign-in");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session?.user?.id))
    .limit(1);

  if (!user) {
    redirect("/sign-in");
  }

  const borrowedBooks = await db
    .select()
    .from(borrowRecords)
    .where(eq(borrowRecords.userId, session?.user?.id))
    .fullJoin(books, eq(books.id, borrowRecords.bookId));

  console.log(borrowedBooks);
  return (
    <main className={"flex max-[1100px]:flex-col items-center flex-row gap-10"}>
      <section className={"h-fit mx-auto relative"}>
        <IdCard session={session} user={user} />
      </section>

      {borrowedBooks.length > 0 ? (
        <section
          className={
            "grid max-[540px]:grid-cols-1 max-[765px]:grid-cols-2 grid-cols-3 gap-6 relative justify-center"
          }
        >
          {borrowedBooks.map(
            (book, i) => i <= 6 && <BorrowBookCard key={i} {...book!} />,
          )}
        </section>
      ) : (
        <div className={"flex flex-col items-center justify-center "}>
          <Image
            src={"/images/no-books.png"}
            alt={"No book found"}
            width={120}
            height={120}
          />

          <p className={"mt-4 font-ibm-plex-sans text-light-200"}>
            Clean slate eh! browse through some books!
          </p>
        </div>
      )}

      {borrowedBooks.length > 6 && (
        <h3 className={"text-destructive text-center"}>
          Some books could not be displayed, return some to see others
        </h3>
      )}
    </main>
  );
};

export default Page;
