import api from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { checkAuth } from "@/redux/authSlice";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { useAppDispatch } from "@/shared/hooks/useAppDispatch";
import { apiErrors } from "@/shared/utils/errorHandler";
import { inviteToken } from "@/shared/utils/inviteToken";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyAccount = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");
  const token = inviteToken.get();
  async function handleSubmit(e: FormEvent) {
    try {
      e.preventDefault();
      if (otp.length !== 6) {
        setErrors({ error: "Please enter a valid OTP" });
        return;
      }
      setLoading(true);
      setErrors({});
      await api.post("/api/auth/email-verify", { email, otp });
      await dispatch(checkAuth()).unwrap();
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
        <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter the 6 digit code sent to</p>
        <p className="text-sm font-medium mt-1">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>

            <InputOTPSeparator />

            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        {errors.error && <ErrorMessage error={errors.error} />}
        <Button type="submit" disabled={loading} className="w-full" variant="outline">
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify OTP"
          )}
        </Button>
      </form>
    </div>
  );
};

export default VerifyAccount;
