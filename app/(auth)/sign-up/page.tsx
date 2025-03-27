"use client";

import React from "react";
import AutoForm from "@/components/AutoForm";
import { signupScheme } from "@/lib/validations";
import { signUp } from "@/lib/actions/auth";

const Page = () => {
  return (
    <AutoForm
      type={"SIGN_UP"}
      schema={signupScheme}
      defaultValues={{
        email: "",
        password: "",
        fullName: "",
        universityId: "",
        universityCard: "",
      }}
      onSubmit={signUp}
    />
  );
};
export default Page;
