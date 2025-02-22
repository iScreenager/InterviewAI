import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <SignUp
      path="/signup"
      appearance={{
        elements: {
          footer: "hidden",
        },
      }}
    />
  );
};

export default SignUpPage;
