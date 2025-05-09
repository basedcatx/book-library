import React from "react";
import BookCover from "@/components/BookCover";
import Image from "next/image";
import dayjs from "dayjs";

interface Props {
  borrow_records: {
    id: string;
    userId: string;
    bookId: string;
    borrowDate: Date;
    dueDate: string;
    returnDate: string | null;
    status: "BORROWED" | "RETURNED";
    createdAt: Date | null;
  } | null;
  books: {
    coverColor?: string;
    coverUrl: string;
    title: string;
    genre: string;
  } | null;
}

const formatDate = (date: string) => dayjs(date).format("MMM DD YYYY HH:mm");

const BorrowBookCard = ({ borrow_records, books }: Props) => {
  const { coverColor, coverUrl, title, genre } = books!;
  const { borrowDate, dueDate } = borrow_records!;

  const d_dueDate = dayjs(dueDate).date() - dayjs().date();

  return (
    <div
      className={
        "text-white relative p-4 rounded-lg shadow-md gradient-vertical font-ibm-plex-sans flex gap-2 flex-col h-fit mx-auto"
      }
    >
      <Image
        src={"/icons/warning.svg"}
        alt={"warning"}
        width={20}
        height={20}
        className={"absolute z-10 top-2 left-2"}
      />

      <div className={`relative mx-auto`}>
        <BookCover coverColor={coverColor} coverUrl={coverUrl} />
      </div>

      <div>
        <h1 className={"id-text-item"}>{title}</h1>
        <h2 className={"id-text-heading"}>{genre}</h2>
      </div>

      <div className={"flex flex-col gap-3"}>
        <div className={"flex gap-2"}>
          <Image
            src={"/icons/book-2.svg"}
            alt={"book"}
            width={20}
            height={20}
          />
          <p className={"text-sm font-semibold id-text-heading-color"}>
            Borrowed on {formatDate(borrowDate.toISOString())}
          </p>
        </div>

        <div className={"flex gap-2"}>
          <Image
            src={d_dueDate > 0 ? "/icons/calendar.svg" : "/icons/warning.svg"}
            alt={"book"}
            width={20}
            height={20}
          />
          {d_dueDate > 0 ? (
            <p className={"font-semibold id-text-heading-color"}>
              {d_dueDate} days left to due
            </p>
          ) : (
            <p className={"font-semibold text-destructive"}>
              {d_dueDate} Overdue Return
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default BorrowBookCard;
