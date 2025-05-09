import React from "react";
import BookCard from "@/components/BookCard";
import { Book } from "@/types";

interface Props {
  title: string;
  books: Book[];
  containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: Props) => {
  if (books.length > 2) {
    return (
      <section className={containerClassName}>
        <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>
        <ul className="book-list">
          {books.map((book: Book) => (
            <BookCard key={book.title} {...book} />
          ))}
        </ul>
      </section>
    );
  }
};
export default BookList;
