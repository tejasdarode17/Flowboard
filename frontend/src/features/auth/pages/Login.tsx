import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiErrors, zodErrors } from "@/shared/utils/errorHandler";
import api from "@/api/axiosInstance";
import { type LoginInput, loginSchema } from "@/features/auth/validations/auth.validations";
import { useAppDispatch } from "@/shared/hooks/useAppDispatch";
import { checkAuth } from "@/redux/authSlice";
import FlowBoardLogo from "@/shared/icons/FlowBoardLogo";
import GoogleIcon from "@/shared/icons/GoogleIcon";
import { useGoogleLogin } from "../hooks/useGoogleLogin";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { inviteToken } from "@/shared/utils/inviteToken";

export default function Login() {
  const [form, setForm] = useState<LoginInput>({
    emailOrUsername: "",
    password: "",
  });

  const [showPw, setShowPw] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = inviteToken.get();

  async function handleSubmit(e: FormEvent) {
    try {
      e.preventDefault();
      setLoading(true);

      const result = loginSchema.safeParse(form);
      if (!result.success) {
        const errs = zodErrors(result);
        setErrors(errs);
        return;
      }

      await api.post("/api/auth/login", form);
      await dispatch(checkAuth()).unwrap();
      navigate(token ? `/invite/${token}` : "/");
    } catch (error: unknown) {
      console.log(error);
      const err = apiErrors(error);
      setErrors(err);
    } finally {
      setLoading(false);
    }
  }

  const { mutateAsync: handleGoolgeLogin } = useGoogleLogin();
  async function googleLogin() {
    try {
      await handleGoolgeLogin();
      await dispatch(checkAuth()).unwrap();
      navigate(token ? `/invite/${token}` : "/");
    } catch (error) {
      const err = apiErrors(error);
      console.log(err);
      setErrors(err);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Right — form */}
      <div className="flex flex-col min-h-screen">
        {/* mobile brand */}
        <div className="flex items-center gap-2.5 p-6 lg:hidden">
          <FlowBoardLogo size={28} />
          <span className="font-syne text-base font-bold tracking-tight">FlowBoard</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm animate-fade-up">
            {/* header */}
            <div className="mb-8">
              <h1 className="font-syne text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
              <p className="mt-1.5 text-sm text-muted-foreground font-dm">Sign in to your FlowBoard workspace.</p>
            </div>

            {/* Google OAuth */}
            <Button onClick={googleLogin} type="button" variant="outline" className="w-full h-10 font-dm font-medium">
              <GoogleIcon />
              Continue with Google
            </Button>

            {/* divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-xs text-muted-foreground font-dm">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="emailOrUsername"
                  placeholder="email or username"
                  value={form.emailOrUsername}
                  onChange={handleChange}
                  disabled={loading}
                  className={`flex h-10 w-full rounded-md border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors disabled:opacity-50 ${errors.emailOrUsername ? "border-destructive" : "border-input"}`}
                />

                {errors.emailOrUsername && <p className="text-xs text-destructive">{errors.emailOrUsername}</p>}
              </div>

              {/* password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to={"/auth/forgot-password"}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors hover:underline underline-offset-2"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                    className={`flex h-10 w-full rounded-md border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors disabled:opacity-50 ${errors.emailOrUsername ? "border-destructive" : "border-input"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              {/* error */}
              {errors && <ErrorMessage error={errors?.error}></ErrorMessage>}

              {/* submit */}
              <Button variant="outline" type="submit" className="w-full h-10 font-dm font-medium" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Signing in…
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </Button>
            </form>

            {/* footer */}
            <p className="mt-6 text-center text-xs text-muted-foreground font-dm">
              Don&apos;t have an account?{" "}
              <Link to={"/auth/register"} className="text-primary font-medium hover:underline underline-offset-2">
                Create one for free
              </Link>
            </p>
          </div>
        </div>

        {/* bottom note */}
        <p className="text-center text-xs text-muted-foreground font-dm pb-6 px-6">
          By signing in you agree to our <span className="text-foreground cursor-pointer hover:underline">Terms</span> and{" "}
          <span className="text-foreground cursor-pointer hover:underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
