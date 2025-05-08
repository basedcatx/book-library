import IdCard from "@/components/IDCard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BorrowBookCard from "@/components/BorrowBookCard";
import { sampleBooks } from "@/app/constants";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import users, { books, borrowRecords } from "@/database/schema";

const Page = async () => {
  const session = await auth();

  if (!session || !session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session?.user?.id));

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
    <main className={"flex max-sm:flex-col flex-row gap-10"}>
      <section>
        <IdCard session={session} user={user} />
      </section>

      <section>
        <BorrowBookCard />
      </section>
    </main>
  );
};

export default Page;
