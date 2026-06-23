import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Loader2, ArrowLeft, Check, Shield, Eye, EyeOff } from "lucide-react";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import api from "@/api/axiosInstance";
import { apiErrors, zodErrors } from "@/shared/utils/errorHandler";
import { passwordSchema } from "@/features/auth/validations/auth.validations";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
}

const ChangePassword = ({ children }: Props) => {
  const { userData } = useAppSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"send-otp" | "verify-otp" | "new-password">("send-otp");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const

  const resetState = () => {
    setStep("send-otp");
    setOtp("");
    setNewPassword("");
    setErrors({});
    setIsLoading(false);
    setShowPassword(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) resetState();
  };

  const handleSendOTP = async (e?: FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      const response = await api.post("/api/auth/change-password");
      if (response?.data?.success) {
        setStep("verify-otp");
      }
      toast.success("Otp Sent");
    } catch (error) {
      setErrors(apiErrors(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrors({ error: "Please enter a valid 6-digit OTP" });
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      const response = await api.post("/api/auth/verify-password/otp", {
        email: userData?.email,
        otp,
      });
      if (response?.data?.success) {
        setStep("new-password");
      }
    } catch (error) {
      setErrors(apiErrors(error));
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      const result = passwordSchema.safeParse({ password: newPassword });
      if (!result.success) {
        setErrors(zodErrors(result));
        setIsLoading(false);
        return;
      }
      await api.post("/api/auth/reset-password", {
        email: userData?.email,
        password: newPassword,
      });
      toast.success("Password has been changed successfully");
      setOpen(false);
    } catch (error) {
      setNewPassword("");
      setErrors(apiErrors(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl p-0 gap-0">
        {/* Step 1: Send OTP */}
        {step === "send-otp" && (
          <form onSubmit={handleSendOTP} className="p-6">
            <div className="mb-4">
              <h3 className="text-[15px] font-semibold">Change Password</h3>
              <p className="text-[13px] text-muted-foreground mt-1">
                An OTP will be sent to <span className="font-medium text-foreground">{userData?.email}</span> for verification.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40">
                <Mail size={15} className="text-muted-foreground shrink-0" />
                <p className="text-[13px] truncate">{userData?.email}</p>
              </div>

              {errors.error && <ErrorMessage error={errors.error} />}

              <Button variant="outline" className="w-full rounded-xl h-10" disabled={isLoading} type="submit">
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-2" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP to Email"
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === "verify-otp" && (
          <div className="p-6">
            <button
              type="button"
              onClick={() => setStep("send-otp")}
              className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-4 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <h3 className="text-[15px] font-semibold">Verify OTP</h3>
                <p className="text-[13px] text-muted-foreground mt-1">Enter the OTP sent to {userData?.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(val) => {
                      setOtp(val);
                      setErrors({});
                    }}
                    autoFocus
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
              </div>

              <Button variant="outline" className="w-full rounded-xl h-10" disabled={isLoading || otp.length !== 6} type="submit">
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-2" />
                  </>
                ) : (
                  <>
                    <Check size={15} className="mr-2" />
                    Verify & Continue
                  </>
                )}
              </Button>

              <p className="text-center text-[12px] text-muted-foreground">
                Didn't receive code?{" "}
                <button
                  type="button"
                  onClick={() => handleSendOTP()}
                  disabled={isLoading}
                  className="text-primary hover:underline font-medium disabled:opacity-50"
                >
                  resend
                </button>
              </p>
            </form>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === "new-password" && (
          <div className="p-6">
            <button
              type="button"
              onClick={() => setStep("verify-otp")}
              className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-4 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <h3 className="text-[15px] font-semibold">Set New Password</h3>
                <p className="text-[13px] text-muted-foreground mt-1">Create a strong password for your account.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[13px]">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    value={newPassword}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="bg-card rounded-xl h-10 text-[13px] pr-10"
                    onChange={(e) => (setNewPassword(e.target.value), setErrors({}))}
                    autoFocus
                  />
                  {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {errors.error && <ErrorMessage error={errors.error} />}

              <Button variant="outline" className="w-full rounded-xl h-10" disabled={isLoading || !newPassword} type="submit">
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Shield size={15} className="mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
