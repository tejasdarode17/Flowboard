import api from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiErrors, zodErrors } from "@/shared/utils/errorHandler";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { emailSchema } from "../validations/auth.validations";
import ErrorMessage from "@/shared/components/ErrorMessage";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    try {
      e.preventDefault();
      const result = emailSchema.safeParse({ email: email });
      if (!result.success) {
        setErrors(zodErrors(result));
        return;
      }
      setLoading(true);
      await api.post("/api/auth/forgot-password", { email });
      navigate(`/auth/verify-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setErrors(apiErrors(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-full w-full mx-auto max-w-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your account email and we'll send you an OTP.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="w-full space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => (setEmail(e.target.value), setErrors({}))}
            placeholder="you@example.com"
            disabled={loading}
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${errors.email ? "border-destructive" : "border-input"}`}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        {errors.error && <ErrorMessage error={errors.error} />}

        <Button type="submit" disabled={loading} variant="outline" className="w-full">
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Sending OTP...
            </>
          ) : (
            "Send OTP"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
