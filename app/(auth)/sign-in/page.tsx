"use client";
import React from "react";
import AutoForm from "@/components/AutoForm";
import { signInScheme } from "@/lib/validations";
import { signInWithCredentials } from "@/lib/actions/auth";

const Page = () => {
  return (
    <AutoForm
      type={"SIGN_IN"}
      schema={signInScheme}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={signInWithCredentials}
    />
  );
};
export default Page;
