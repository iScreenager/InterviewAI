import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "@/context/auth-context";
import { loginWithGoogle, registerWithEmail } from "@/services/auth";


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
      const result = await registerWithEmail(email, password);
      localStorage.setItem("userData", JSON.stringify(result.user));
      setUser(JSON.parse(JSON.stringify(result.user)));
      navigate("/");
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        message = "An account with this email already exists. Try logging in.";
      }
      toast.error("Sign-Up Failed", { description: message });
    }
  };

  const handleGoogleSign = async () => {
    try {
      const result = await loginWithGoogle();
      localStorage.setItem("userData", JSON.stringify(result.user));
      setUser(JSON.parse(JSON.stringify(result.user)));
      navigate("/");
    } catch {
      toast.error("Sign-Up Failed", {
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
          <p className="text-sm text-muted-foreground">
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a href="#" className="ml-auto text-sm text-blue-500 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600">
            Create
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-gray-100 px-5 text-muted-foreground">
              or
            </span>
          </div>
          <Button onClick={handleGoogleSign} variant="outline" className="w-full">
            SignUp with Google
          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/signin" className="underline text-blue-500">Login</a>
        </div>
      </form>
    </div>
  );
}
