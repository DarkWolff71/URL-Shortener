"use client";

import SparklesFullPageWrapper from "./ui/sparklesFullPageWrapper";
import { SignupForm } from "./SignupForm";
import { Title } from "./Title";

export function Signup() {
  return (
    <SparklesFullPageWrapper>
      <Title className="mb-10"></Title>
      <SignupForm></SignupForm>
    </SparklesFullPageWrapper>
  );
}
