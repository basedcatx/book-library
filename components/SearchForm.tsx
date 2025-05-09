"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";

import { searchBookSchema } from "@/lib/validations";
import Image from "next/image";

interface Props {
  onSubmit: (values: z.infer<typeof searchBookSchema>) => void;
  onClear: () => void;
}

const SearchForm = ({ onSubmit, onClear }: Props) => {
  const form = useForm({
    resolver: zodResolver(searchBookSchema),
    defaultValues: {
      title: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)();
        }}
        className="w-full space-y-6"
      >
        <FormField
          name={"title"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div
                  className={
                    "flex gap-1 border rounded-lg px-4 p-2 w-full max-w-lg mx-auto mt-6 search items-center"
                  }
                >
                  <Image
                    src={"/icons/search-fill.svg"}
                    alt={"search"}
                    width={20}
                    height={20}
                  />
                  <Input
                    {...field}
                    className={"border-none ring-0 search-input"}
                  />
                  <p
                    className={"text-red-400 text-xl cursor-pointer"}
                    onClick={() => {
                      form.reset();
                      onClear();
                    }}
                  >
                    X
                  </p>
                </div>
              </FormControl>
              <FormMessage className={"text-center"} />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SearchForm;
