import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Loader2, ArrowLeft, Check } from "lucide-react";
import { useAppSelector } from "@/shared/hooks/useAppSelector";
import api from "@/api/axiosInstance";
import { emailSchema } from "@/features/auth/validations/auth.validations";
import { apiErrors, zodErrors } from "@/shared/utils/errorHandler";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useAppDispatch } from "@/shared/hooks/useAppDispatch";
import { checkAuth } from "@/redux/authSlice";

interface Props {
  children: React.ReactNode;
}

const ChangeEmail = ({ children }: Props) => {
  const { userData } = useAppSelector((store) => store?.auth);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"new-email" | "verify-otp">("new-email");
  const [isLoading, setIsLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dispatch = useAppDispatch();

  const resetState = () => {
    setStep("new-email");
    setNewEmail("");
    setOtp("");
    setErrors({});
    setIsLoading(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) resetState();
  };

  const handleSendOTP = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      const result = emailSchema.safeParse({ email: newEmail });
      if (!result.success) {
        setErrors(zodErrors(result));
        setIsLoading(false);
        return;
      }
      const response = await api.post("/api/auth/change-email", { email: newEmail });
      if (response?.data?.success) {
        setStep("verify-otp");
      }
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
      await api.post("/api/auth/change-email-verify", { email: newEmail, otp });
      toast.success("Email updated successfully");
      dispatch(checkAuth());
      setOpen(false);
    } catch (error) {
      setErrors(apiErrors(error));
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl p-0 gap-0">
        {/* Step 1: Enter New Email */}
        {step === "new-email" && (
          <>
            <DialogHeader className="px-6 pt-6 pb-4">
              <DialogTitle className="text-lg font-semibold">Change Email Address</DialogTitle>
              <DialogDescription className="text-[13px]">Enter your new email address. A verification OTP will be sent.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSendOTP} noValidate className="px-6 pb-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-[13px]">Current Email</Label>
                <Input value={userData?.email || ""} disabled className="rounded-xl h-10 bg-muted/30 text-[13px]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px]">
                  New Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="newemail@example.com"
                  value={newEmail}
                  onChange={(e) => (setNewEmail(e.target.value), setErrors({}))}
                  className="bg-card rounded-xl h-10 text-[13px]"
                  autoFocus
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {errors.error && <ErrorMessage error={errors.error} />}

              <Button variant="outline" className="w-full rounded-xl h-10" disabled={isLoading || !newEmail} type="submit">
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-2" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </form>
          </>
        )}

        {/* Step 2: Verify OTP */}
        {step === "verify-otp" && (
          <div className="p-6">
            <button
              type="button"
              onClick={() => setStep("new-email")}
              className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-4 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <h3 className="text-[15px] font-semibold">Verify OTP</h3>
                <p className="text-[13px] text-muted-foreground mt-1">
                  Enter the OTP sent to <span className="font-medium text-foreground">{newEmail}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30 border border-border/40">
                <Mail size={15} className="text-muted-foreground shrink-0" />
                <p className="text-[13px] truncate">{newEmail}</p>
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
              </div>

              {errors.error && <ErrorMessage error={errors.error} />}

              <Button variant="outline" className="w-full rounded-xl h-10" disabled={isLoading || otp.length !== 6} type="submit">
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Check size={15} className="mr-2" />
                    Verify & Update Email
                  </>
                )}
              </Button>

              <p className="text-center text-[12px] text-muted-foreground">
                Didn't receive code?{" "}
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="text-primary hover:underline font-medium disabled:opacity-50"
                >
                  Resend
                </button>
              </p>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmail;
