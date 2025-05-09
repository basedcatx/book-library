import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  pageNumber: number;
  pageNumbers: number[];
  setPageNumber: (pageNumber: number) => void;
}
const SearchPagination = ({
  pageNumbers,
  setPageNumber,
  pageNumber,
}: Props) => {
  return (
    <Pagination className={"mt-10"}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={"cursor-pointer"}
            onClick={() => pageNumber >= 0 && setPageNumber(pageNumber - 1)}
          />
        </PaginationItem>
        {pageNumbers.map((num) => (
          <PaginationItem key={num} className={"cursor-pointer flex"}>
            <PaginationLink onClick={() => setPageNumber(num)}>
              {num}
            </PaginationLink>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                className={"cursor-pointer"}
                onClick={() =>
                  pageNumber <= pageNumbers.length && setPageNumber(num)
                }
              />
            </PaginationItem>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
};

export default SearchPagination;
