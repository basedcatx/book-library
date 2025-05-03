"use server";

import { BookParams } from "@/types";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Error occurred while creating Book",
    };
  }
};
