import React from "react";
import BookCover from "@/components/BookCover";

interface Props {
  coverColor: string;
  coverUrl: string;
  title: string;
  genre: string;
}

const BorrowBookCard = ({ coverColor, coverUrl, title, genre }: Props) => {
  return (
    <div className={"text-white font-ibm-plex-sans flex gap-2 flex-col"}>
      <h1
        className={
          "id-text-heading-color font-semibold text-4xl max-md:text-xl"
        }
      >
        Borrowed books
      </h1>
      <div className={`rounded-2xl mt-4 p-4 border bg-${coverColor}`}>
        <BookCover coverColor={coverColor} coverUrl={coverUrl} />
      </div>
      <div>
        <h1>{title}</h1>
        <h2>{genre}</h2>
      </div>
    </div>
  );
};
export default BorrowBookCard;
