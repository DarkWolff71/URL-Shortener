import { SigninForm } from "./SigninForm";
import { Title } from "./Title";
import SparklesFullPageWrapper from "./ui/sparklesFullPageWrapper";

export function Signin() {
  return (
    <SparklesFullPageWrapper>
      <Title className="mb-10"></Title>
      <SigninForm></SigninForm>
    </SparklesFullPageWrapper>
  );
}
