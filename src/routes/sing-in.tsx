import { LoginForm } from "@/components/login-form";

const SignInPage = () => {
  return (
    <div className="z-10 flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;
