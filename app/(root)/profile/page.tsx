import { Button } from "@/components/ui/button";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/app/constants";
import { signOut } from "@/auth";

const Page = () => {
  return (
    <section>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button className={"my-2 bg-light-200 text-black hover:text-light-100"}>
          Logout
        </Button>
      </form>

      <BookList title={"Borrowed Books"} books={sampleBooks} />
    </section>
  );
};

export default Page;
