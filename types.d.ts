import { FieldValues } from "react-hook-form";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  summary: string;
  isLoanedBook?: boolean;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}

interface AuthCredentials extends FieldValues {
  fullName?: string;
  email: string;
  password: string;
  universityId: string;
  universityCard: string;
}

interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  summary: string;
}
