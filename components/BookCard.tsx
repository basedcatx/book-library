import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import { Book } from "@/types";

const BookCard = ({ id, title, genre, coverColor, coverUrl }: Book) => {
  return (
    <li className={"p-2"}>
      <Link href={`/books/${id}`} className={"flex flex-col items-center"}>
        <BookCover coverUrl={coverUrl} coverColor={coverColor} />

        <div className={cn("mt-4")}>
          <p className="book-title">{title}</p>
          <p className="book-genre">{genre}</p>
        </div>
      </Link>
    </li>
  );
};
export default BookCard;
