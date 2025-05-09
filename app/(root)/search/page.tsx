"use client";

import React, { useState } from "react";
import SearchForm from "@/components/SearchForm";
import { searchBook } from "@/lib/actions/book";
import { Book } from "@/types";
import Image from "next/image";
import SearchPagination from "@/components/SearchPagination";
import BookCard from "@/components/BookCard";
import Link from "next/link";

const Page = () => {
  const [searchResults, setSearchResults] = useState<Book[] | undefined>(
    undefined,
  );

  const [title, setTitle] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  const startIndex = (page - 1) * 6;
  const endIndex = startIndex + 6;

  // const totalPages = Math.ceil(searchResults?.length || 0 / 6);

  const paginate = (pageNumber: number) => setPage(pageNumber);

  const pageNumbers = [...Array(searchResults || []).keys()].map(
    (number) => number + 1,
  );

  const handleSearch = async (data: { title: string }) => {
    try {
      setTitle(data.title);
      const result = await searchBook(data);
      setSearchResults(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className={"text-light-100 font-ibm-plex-sans"}>
      <section className={"flex flex-col items-center max-w-lg mx-auto"}>
        <h2 className={"uppercase"}>Discover Your Next Great Read:</h2>
        <p className={"mt-4 font-semibold text-4xl text-center"}>
          Explore and Search for
          <span className={"text-light-200"}> Any Book</span> In our Vast
          Library
        </p>
        <SearchForm
          onSubmit={handleSearch}
          onClear={() => {
            setSearchResults(undefined);
            setTitle(null);
          }}
        />
      </section>

      {searchResults && (
        <section className={"mt-10 xl:mt-16"}>
          <p className={"font-ibm-plex-sans text-lg id-text-heading-color"}>
            Search Result for{" "}
            {title && <span className={"text-light-200"}>{title}</span>}
          </p>
          {searchResults.length <= 0 ? (
            <div className={"mt-12"}>
              <Image
                src={"/images/no-books.png"}
                alt={"No book"}
                width={200}
                className={"mx-auto"}
                height={200}
              />
              <p
                className={
                  "font-ibm-plex-sans font-bold text-xl mt-4 text-center"
                }
              >
                No Results Found
              </p>{" "}
              <p
                className={
                  "font-ibm-plex-sans text-light-100/80 mt-4 text-center max-w-lg mx-auto"
                }
              >
                We couldn&#39;t find any matching your search. Try using
                different keywords or check for typos.
              </p>
            </div>
          ) : (
            <div className={"w-full"}>
              <ul className={"book-list"}>
                {searchResults.slice(startIndex, endIndex).map((book: Book) => (
                  <Link href={`/books/${book.id}`} key={book.id}>
                    <BookCard {...book} />
                  </Link>
                ))}
              </ul>
            </div>
          )}
          {searchResults.length > 0 && (
            <SearchPagination
              pageNumber={page}
              pageNumbers={pageNumbers}
              setPageNumber={paginate}
            />
          )}
        </section>
      )}
    </main>
  );
};

export default Page;
