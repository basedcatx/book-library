import React from "react";
import Image from "next/image";
import BookCover from "@/components/BookCover";
import { Book } from "@/types";
import BorrowBook from "@/components/BorrowBook";
import { db } from "@/database/seed";
import users from "@/database/schema";
import { eq } from "drizzle-orm";

interface Props extends Book {
  userid: string;
}
const BookOverview = async ({
  title,
  author,
  genre,
  rating,
  totalCopies: total_copies,
  availableCopies: available_copies,
  description,
  coverColor,
  coverUrl,
  id,
  userid,
}: Props) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userid))
    .limit(1);

  const borrowEligibility = {
    isEligible: available_copies > 0 && user.status === "APPROVED",
    message:
      available_copies <= 0
        ? "No more available copies of this book. Sorry!"
        : "You account hasn't been approved. You can't borrow books just yet!",
  };
  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>
        <div className="book-info">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>
          <p>
            Category
            <span className="font-semibold text-light-200"> {genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>
        </div>
        <div className="book-copies">
          <p>
            Total books: <span>{total_copies}</span>
          </p>

          <p>
            Available books: <span>{available_copies}</span>
          </p>
        </div>
        <p className="book-description">{description}</p>
        {user && (
          <BorrowBook
            bookId={id}
            userId={userid!}
            borrowEligibility={borrowEligibility}
          />
        )}
      </div>
      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover
            variant={"wide"}
            className={"z-10"}
            coverColor={coverColor}
            coverUrl={coverUrl}
          />

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <BookCover
              variant={"wide"}
              className={"z-10"}
              coverColor={coverColor}
              coverUrl={coverUrl}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default BookOverview;
