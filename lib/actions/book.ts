"use server";

import { BorrowBookParams } from "@/types";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq, ilike } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;
  try {
    const book = await db
      .select({
        availableCopies: books.availableCopies,
      })
      .from(books)
      .where(eq(books.id, bookId));

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    const record = await db.insert(borrowRecords).values({
      bookId,
      userId,
      status: "BORROWED",
      dueDate,
    });

    await db
      .update(books)
      .set({
        availableCopies: book[0].availableCopies - 1,
      })
      .where(eq(books.id, bookId));
    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (err: unknown) {
    console.error(err);
    if (err.constraint && err.constraint.length > 0) {
      if (err.constraint === "user_and_book_must_be_unique") {
        return {
          success: false,
          error: "Sorry you can't borrow the same book twice",
        };
      }
    }
    return {
      success: false,
      error: err.message ? err.message : err.toString(),
    };
  }
};

export const searchBook = async (values: { title: string }) => {
  const { title } = values;

  try {
    return await db
      .select()
      .from(books)
      .where(ilike(books.title, `%${title}%`));
  } catch (err) {
    console.log(err);
  }
};
