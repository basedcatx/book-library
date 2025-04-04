"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/app/constants";
import ImageUpload from "@/components/ImageUpload";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AutoForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const router = useRouter();
  const isSignedIn = type === "SIGN_IN";

  const [isHidden, setIsHidden] = useState<boolean>(true);

  const auth_form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    setIsHidden(false);
    if (!data) {
      setIsHidden(true);
      return;
    }
    const res = await onSubmit(data);

    if (res?.success) {
      toast({
        title: "Success",
        description: isSignedIn
          ? "You have successfully signed in"
          : "You have successfully signed up",
      });

      router.push("/");
    } else {
      setIsHidden(true);
      toast({
        title: isSignedIn ? "Error signing in" : "Error signing up",
        description: res?.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className={"flex flex-col gap-4"}>
      <h1 className={"text-2xl font-semibold text-white"}>
        {isSignedIn ? "Welcome back" : "Create your library account"}
      </h1>
      <p className={"text-white"}>
        {isSignedIn
          ? "Access the vast collection of resources and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library!"}
      </p>
      <Form {...auth_form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            auth_form.handleSubmit(handleSubmit)();
          }}
          className="w-full space-y-6"
        >
          {Object.keys(defaultValues).map((key) => (
            <FormField
              key={key}
              control={auth_form.control}
              name={key as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={"capitalize"}>
                    {String(
                      FIELD_NAMES[field.name as keyof typeof FIELD_NAMES],
                    )}
                  </FormLabel>
                  <FormControl>
                    {key.toString() === "universityCard" ? (
                      <ImageUpload onFileChange={field.onChange} />
                    ) : (
                      <Input
                        required
                        type={
                          FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]
                        }
                        {...field}
                        className={"form-input"}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className={"form-btn"}>
            <Loading isHidden={isHidden} />
            {isSignedIn ? "Sign in" : "Sign up"}
          </Button>
        </form>
      </Form>
      <p className={"text-center text-base font-medium"}>
        {isSignedIn ? "New to Book Library? " : "Already have an account? "}

        <Link
          href={isSignedIn ? "/sign-up" : "/sign-in"}
          className={"font-bold text-light-200"}
        >
          {isSignedIn ? "Create your library account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};
export default AutoForm;
