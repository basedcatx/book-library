import React, { Fragment } from "react";
import BookOverview from "@/components/BookOverview";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/app/constants";

const Page = async () => {
  return (
    <Fragment>
      <BookOverview {...sampleBooks[0]} />
      <BookList
        title="Latest Books"
        books={sampleBooks}
        containerClassName="mt-28"
      />
    </Fragment>
  );
};
export default Page;
