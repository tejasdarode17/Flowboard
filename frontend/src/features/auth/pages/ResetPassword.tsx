import api from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { apiErrors, zodErrors } from "@/shared/utils/errorHandler";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { inviteToken } from "@/shared/utils/inviteToken";
import { passwordSchema } from "../validations/auth.validations";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");
  const token = inviteToken.get();

  async function handleSubmit(e: FormEvent) {
    try {
      e.preventDefault();
      setLoading(true);

      const result = passwordSchema.safeParse({ password: newPassword });
      if (!result.success) {
        setErrors(zodErrors(result));
        return;
      }

      await api.post("/api/auth/reset-password", { email, password: newPassword });
      toast.success("Password has been changed successfully");
      navigate(token ? `/invite/${token}` : "/");
      
    } catch (error) {
      setErrors(apiErrors(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-full w-full mx-auto max-w-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter the OTP sent to your email and choose a new password.</p>
        {email && <p className="text-sm font-medium mt-1">{email}</p>}
      </div>

      <form onSubmit={handleSubmit} noValidate className="w-full space-y-5">
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            New Password
          </label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  newPassword: "",
                }));
              }}
              placeholder="Enter new password"
              disabled={loading}
              className={`flex h-10 w-full rounded-md border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors disabled:opacity-50 ${errors.newPassword ? "border-destructive" : "border-input"}`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        {errors.error && <ErrorMessage error={errors.error} />}

        <Button type="submit" disabled={loading} variant="outline" className="w-full">
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
