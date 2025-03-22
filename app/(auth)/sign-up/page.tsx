"use client";

import React from "react";
import AutoForm from "@/components/AutoForm";
import { signInScheme, signupScheme } from "@/lib/validations";

const Page = () => {
  return (
    <AutoForm
      type={"SIGN_UP"}
      scheme={signupScheme}
      defaultValues={{
        email: "",
        password: "",
        fullName: "",
        universityId: "",
        universityCard: "",
      }}
      onSubmit={() => {}}
    />
  );
};
export default Page;
