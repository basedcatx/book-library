"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Book } from "@/types";
import { bookSchema } from "@/lib/validations";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import ColorPicker from "@/components/admin/forms/ColorPicker";
import { createBook } from "@/lib/admin/actions/book";
import { toast } from "@/hooks/use-toast";

interface Props extends Partial<Book> {
  type?: "create" | "update";
}

const BookForm = ({ type, ...book }: Props) => {
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof bookSchema>) => {
    const result = await createBook(values);
    if (result.success) {
      toast({
        title: "Success",
        description: "Book created successfully",
      });

      router.push(`/admin/books/${result.data.id}`);
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const auth_form = useForm<z.infer<typeof bookSchema>>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      genre: "",
      description: "",
      rating: 1,
      totalCopies: 1,
      coverUrl: "",
      summary: "",
    },
  });

  return (
    <div className={"flex flex-col gap-4"}>
      <Form {...auth_form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            auth_form.handleSubmit(onSubmit)();
          }}
          className="space-y-8"
        >
          <FormField
            control={auth_form.control}
            name={"title"}
            render={({ field }) => (
              <FormItem className={"flex flex-col gap-1"}>
                <FormLabel className={"text-base font-normal text-dark-500"}>
                  Book Title
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder={"Book Title"}
                    {...field}
                    className={"form-form_input"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={auth_form.control}
            name={"author"}
            render={({ field }) => (
              <FormItem className={"flex flex-col gap-1"}>
                <FormLabel className={"text-base font-normal text-dark-500"}>
                  Book Author
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder={"Book author"}
                    {...field}
                    className={"form-form_input"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={auth_form.control}
            name={"genre"}
            render={({ field }) => (
              <FormItem className={"flex flex-col gap-1"}>
                <FormLabel className={"text-base font-normal text-dark-500"}>
                  Book Genre
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder={"Book genre"}
                    {...field}
                    className={"form-form_input"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={auth_form.control}
            name={"rating"}
            render={({ field }) => (
              <FormItem className={"flex flex-col gap-1"}>
                <FormLabel className={"text-base font-normal text-dark-500"}>
                  Book Rating
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder={"Book rating"}
                    {...field}
                    className={"form-form_input"}
                    type={"number"}
                    min={1}
                    max={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={auth_form.control}
            name={"totalCopies"}
            render={({ field }) => (
              <FormItem className={"flex flex-col gap-1"}>
                <FormLabel className={"text-base font-normal text-dark-500"}>
                  Total Copies
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder={"Total Copies"}
                    {...field}
                    className={"form-form_input"}
                    type={"number"}
                    min={1}
                    max={10000}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={auth_form.control}
            name={"coverUrl"}
            render={({ field }) => (
              <FormItem className={"flex flex-col gap-1"}>
                <FormLabel className={"text-base font-normal text-dark-500"}>
                  Book Image
                </FormLabel>
                <FormControl>
                  <FileUpload
                    type={"Image"}
                    accept={"image/*"}
                    placeholder={"Upload a book cover"}
                    folder={"xbooks/books/covers"}
                    variant={"light"}
                    onFileChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={auth_form.control}
            name={"coverColor"}
            render={({ field }) => (
              <FormItem className={"flex flex-col gap-1"}>
                <FormLabel className={"text-base font-normal text-dark-500"}>
                  Primary Color
                </FormLabel>
                <FormControl>
                  <ColorPicker
                    value={field.value}
                    onPickerChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={auth_form.control}
            name={"description"}
            render={({ field }) => (
              <FormItem className={"flex flex-col gap-1"}>
                <FormLabel className={"text-base font-normal text-dark-500"}>
                  Book Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={10}
                    placeholder={"Book description"}
                    className={"book-form_input"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={auth_form.control}
            name={"summary"}
            render={({ field }) => (
              <FormItem className={"flex flex-col gap-1"}>
                <FormLabel className={"text-base font-normal text-dark-500"}>
                  Book Summary
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder={"Book summary"}
                    className={"book-form_input"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className={"book-form_btn"}>
            Add Book to Library
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default BookForm;
