"use client";
import React from "react";
import AutoForm from "@/components/AutoForm";
import { signInScheme } from "@/lib/validations";

const Page = () => {
  return (
    <AutoForm
      type={"SIGN_IN"}
      scheme={signInScheme}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={() => {}}
    />
  );
};
export default Page;
