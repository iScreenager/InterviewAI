import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "@/context/auth-context";
import { loginWithEmail, loginWithGoogle, loginAsGuest } from "@/services/auth";

export function LoginForm({
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
      const result = await loginWithEmail(email, password);
      localStorage.setItem("userData", JSON.stringify(result.user));
      setUser(JSON.parse(JSON.stringify(result.user)));
      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      let message = "Invalid email or password. Please try again.";
      if (error === "auth/user-not-found") {
        message = "No user found with this email.";
      } else if (error === "auth/wrong-password") {
        message = "Incorrect password.";
      }
      toast.error("Login failed", { description: message });
    }
  };

  const handleGoogleSign = async () => {
    try {
      const result = await loginWithGoogle();
      localStorage.setItem("userData", JSON.stringify(result.user));
      setUser(JSON.parse(JSON.stringify(result.user)));
      navigate("/dashboard", { replace: true });
    } catch {
      toast.error("Login failed", {
        description: "Login with Google failed. Please try again.",
      });
    }
  };

  const handleGuestSign = async () => {
    try {
      const result = await loginAsGuest();
      sessionStorage.setItem("userData", JSON.stringify(result.user));
      setUser(JSON.parse(JSON.stringify(result.user)));
      navigate("/dashboard", { replace: true });
    } catch {
      toast.error("Guest login failed", {
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="rounded-lg bg-gray-200 shadow-2xl bg-opacity-40 p-5">
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        onSubmit={handleSign}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Welcome Back!</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a
              href="#"
              className="ml-auto text-sm text-blue-500 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
          >
            Login
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-gray-100 px-5 text-muted-foreground">
              or
            </span>
          </div>
          <Button
            type="button"
            onClick={handleGoogleSign}
            variant="outline"
            className="w-full"
          >
            Login with Google
          </Button>
          <Button
            type="button"
            onClick={handleGuestSign}
            variant="outline"
            className="w-full"
          >
            Login as Guest
          </Button>
        </div>
        <div className="text-center text-sm">
          Not registered yet?{" "}
          <a href="/signup" className="underline text-blue-500">
            Create an account
          </a>
        </div>
      </form>
    </div>
  );
}
