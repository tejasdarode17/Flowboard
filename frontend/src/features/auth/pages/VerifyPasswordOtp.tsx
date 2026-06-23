import api from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { apiErrors } from "@/shared/utils/errorHandler";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyPasswordOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (otp.length !== 6) {
      setErrors({ error: "Please enter a valid 6-digit OTP" });
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/verify-password/otp", { email, otp });
      navigate(`/auth/reset-password?email=${encodeURIComponent(email!)}`);
    } catch (error) {
      setErrors(apiErrors(error));
      setOtp("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-full w-full mx-auto max-w-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Verify OTP</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter the 6-digit code sent to</p>
        {email && <p className="text-sm font-medium mt-1">{email}</p>}
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(val) => {
              setOtp(val);
              setErrors({});
            }}
          >
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

        <Button type="submit" disabled={loading || otp.length !== 6} className="w-full">
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

export default VerifyPasswordOtp;
