import React, { Fragment } from "react";
import BookOverview from "@/components/BookOverview";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/app/constants";
import { db } from "@/database/drizzle";
import users from "@/database/schema";

const Page = async () => {
  const result = await db.select().from(users);
  console.log(JSON.stringify(result, null, 2));

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
