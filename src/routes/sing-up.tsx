import { SignUpForm } from "@/components/signup-form";

const SignUpPage = () => {
  return (
    <div className="z-10 flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
