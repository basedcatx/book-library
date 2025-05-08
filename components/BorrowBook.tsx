"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";
import Image from "next/image";
import { BorrowBookParams } from "@/types";
import { redirect, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { borrowBook } from "@/lib/actions/book";
interface Props extends BorrowBookParams {
  borrowEligibility: {
    isEligible: boolean;
    message: string;
  };
}
const BorrowBook = ({
  bookId,
  userId,
  borrowEligibility: { isEligible, message },
}: Props) => {
  const router = useRouter();
  const [borrowing, setBorrowing] = React.useState<boolean>(false);
  const handleBorrow = async () => {
    if (!isEligible) {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      return;
    }

    setBorrowing(true);
    try {
      const result = await borrowBook({ bookId, userId });
      if (result.success) {
        toast({
          title: "Success",
          description: "Book borrowed successfully!",
        });

        router.push(`/books/${bookId}`);
      } else {
        toast({
          title: "Error",
          description: result.error as string,
          variant: "destructive",
        });
      }
    } catch (err: unknown) {
      console.error(err);
      toast({
        title: "Error",
        description: "An error occurred while borrowing",
        variant: "destructive",
      });
    } finally {
      setBorrowing(false);
    }
  };
  return (
    <div>
      <Button
        className="book-overview_btn"
        disabled={borrowing}
        onClick={handleBorrow}
      >
        <Loading isHidden={!borrowing} />
        <Image src="/icons/book.svg" alt="book" width={20} height={20} />
        <p className="font-bebas-neue text-xl text-dark-400">
          {borrowing ? "Borrowing..." : "Borrow"}
        </p>
      </Button>
    </div>
  );
};
export default BorrowBook;
