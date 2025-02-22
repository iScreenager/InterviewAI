import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <SignIn
      path="/signin"
      appearance={{
        elements: {
          footer: "hidden",
        },
      }}
    />
  );
};

export default SignInPage;
