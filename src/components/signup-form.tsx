import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "@/context/auth-context";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext);

  const handleSign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (result.user) {
        localStorage.setItem("userData", JSON.stringify(result.user));
        setUser(JSON.parse(JSON.stringify(result.user)));
        navigate("/");
      }
    } catch (error: unknown) {
      console.log("Sign-up error:", error);
      if (typeof error === "object" && error !== null && "code" in error) {
        let message = "Something went wrong. Please try again.";

        switch (error.code) {
          case "auth/email-already-in-use":
            message =
              "An account with this email already exists. Try logging in.";
            break;
          default:
            message = "Something went wrong. Please try again.";
        }
        toast.error("Sign-Up Fail", { description: message });
      }
    }
  };

  const googleSign = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        localStorage.setItem("userData", JSON.stringify(result.user));
        setUser(JSON.parse(JSON.stringify(result.user)));
        navigate("/");
      }
    } catch (error) {
      console.log("Error while login with google", error);
      toast.error("Sign-Up Fail", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  
  return (
    <div className="rounded-lg bg-gray-200 shadow-2xl bg-opacity-40 p-5">
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        onSubmit={handleSign}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Practice like it's real. Perform like a pro.
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="qwerty123@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline text-blue-500">
              Forgot your password?
            </a>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
            Create
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-gray-100 px-5 text-muted-foreground">
              or
            </span>
          </div>
          <Button onClick={googleSign} variant="outline" className="w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            SignUp with Google
          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a
            href="/signin"
            className="underline underline-offset-4 text-blue-500">
            Login
          </a>
        </div>
      </form>
    </div>
  );
}
