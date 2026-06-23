import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import api from "@/api/axiosInstance";
import { registrationSchema, type RegisterInput } from "@/features/auth/validations/auth.validations";
import { apiErrors, zodErrors } from "@/shared/utils/errorHandler";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/redux/store";
import { checkAuth } from "@/redux/authSlice";
import FlowBoardLogo from "@/shared/icons/FlowBoardLogo";
import GoogleIcon from "@/shared/icons/GoogleIcon";
import StrengthBar from "../components/StrengthBar";
import { useGoogleLogin } from "../hooks/useGoogleLogin";
import { Button } from "@/components/ui/button";
import { inviteToken } from "@/shared/utils/inviteToken";

const Register = () => {
  const [showPw, setShowPw] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState<RegisterInput>({
    name: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  const token = inviteToken.get();

  async function handleSubmit(e: FormEvent) {
    try {
      e.preventDefault();
      setLoading(true);

      const result = registrationSchema.safeParse(form);

      if (!result.success) {
        setErrors(zodErrors(result));
        return;
      }
      await api.post("/api/auth/register", form);
      navigate(`/auth/verify?email=${form.email}`);
    } catch (error) {
      setErrors(apiErrors(error));
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
    <div className="flex-1 flex flex-col min-h-screen">
      {/* mobile brand — hidden on lg since AuthLeftSection handles it */}
      <div className="flex items-center gap-2.5 p-6 lg:hidden">
        <FlowBoardLogo size={28}></FlowBoardLogo>
        <span className="font-syne text-base font-bold tracking-tight">FlowBoard</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          {/* heading */}
          <div className="mb-7">
            <h1 className="font-syne text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Free forever. No credit card required.</p>
          </div>

          {/* Google OAuth */}
          <Button variant="outline" onClick={googleLogin} type="button" className="w-full">
            <GoogleIcon></GoogleIcon>
            Continue with Google
          </Button>

          {/* divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">or register with email</span>
            </div>
          </div>

          {/* form */}
          <form className="space-y-4" noValidate onSubmit={handleSubmit}>
            {/* name + username */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                  Full name <span className="text-destructive">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Alex Johnson"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                  className={`flex h-10 w-full rounded-md border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors disabled:opacity-50 ${errors.name ? "border-destructive" : "border-input"}`}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="username" className="text-xs font-medium text-muted-foreground">
                  Username <span className="text-destructive">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="alexj"
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange}
                  disabled={loading}
                  className={`flex h-10 w-full rounded-md border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors disabled:opacity-50 ${errors.username ? "border-destructive" : "border-input"}`}
                />
                {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
              </div>
            </div>

            {/* email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                Work email <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                className={`flex h-10 w-full rounded-md border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors disabled:opacity-50 ${errors.email ? "border-destructive" : "border-input"}`}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* mobile */}
            <div className="space-y-1.5">
              <label htmlFor="mobile" className="text-xs font-medium text-muted-foreground">
                Mobile <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                placeholder="+91 98765 43210"
                autoComplete="tel"
                value={form.mobile}
                onChange={handleChange}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors disabled:opacity-50"
              />
            </div>

            {/* password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`flex h-10 w-full rounded-md border bg-card px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors disabled:opacity-50 ${errors.password ? "border-destructive" : "border-input"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* strength bar */}
              <StrengthBar password={form.password} errors={errors}></StrengthBar>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            {errors && <p className="text-xs text-destructive font-dm">{errors?.error}</p>}

            {/* submit */}
            <Button type="submit" disabled={loading} variant="outline" className="w-full">
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Creating account…
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight size={15} />
                </>
              )}
            </Button>
          </form>

          {/* footer link */}
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to={"/auth"} className="text-primary font-medium hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* terms */}
      <p className="text-center text-xs text-muted-foreground pb-6 px-6">
        By creating an account you agree to our <span className="text-foreground cursor-pointer hover:underline">Terms</span> and{" "}
        <span className="text-foreground cursor-pointer hover:underline">Privacy Policy</span>.
      </p>
    </div>
  );
};

export default Register;
