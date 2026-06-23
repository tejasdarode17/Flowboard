import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, User, AtSign, Phone, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "../hooks/useUserProfile";
import { editProfileSchema, type EditProfileInputInput } from "../validations/editProfile.validations";
import { useEditProfile } from "../hooks/useEditProfile";
import { setFormErrors } from "@/shared/utils/errorHandler";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { useAppDispatch } from "@/shared/hooks/useAppDispatch";
import { checkAuth } from "@/redux/authSlice";

const EditProfile = () => {
  const { username } = useParams();
  const { data, isLoading } = useUserProfile(username!);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm<EditProfileInputInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
      username: "",
      mobile: "",
    },
  });

  useEffect(() => {
    if (!data) return;
    reset({
      name: data.name,
      username: data.username,
      mobile: data.mobile ?? "",
    });
  }, [data, reset]);

  const preview = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    return data?.avatar ?? null;
  }, [selectedFile, data?.avatar]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("avatar", { message: "Only image files are allowed" });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("avatar", { message: "File size must be under 20MB" });
      return;
    }
    setSelectedFile(file);
    setValue("avatar", file, { shouldDirty: true, shouldValidate: true });
  };

  const removeImage = () => {
    setSelectedFile(null);
    setValue("avatar", undefined, { shouldDirty: true });
  };

  const { mutateAsync, isPending } = useEditProfile(username!);

  const onSubmit = async (data: EditProfileInputInput) => {
    const fromData = new FormData();
    if (data.name) fromData.append("name", data.name);
    if (data.username) fromData.append("username", data.username);
    if (data.mobile) fromData.append("mobile", data.mobile);
    if (data.avatar instanceof File) fromData.append("avatar", data.avatar);
    try {
      await mutateAsync(fromData);
      dispatch(checkAuth());
      navigate(`/profile/${data.username}`);
    } catch (error) {
      setFormErrors(error, setError);
    }
  };

  if (isLoading) {
    return <EditProfileSkeleton />;
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-175 mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(`/profile/${username}`)}
        className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6 group"
      >
        <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform duration-150" />
        Back to profile
      </button>

      <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border/30">
          <h1 className="text-lg font-semibold tracking-tight">Edit Profile</h1>
          <p className="text-[13px] text-muted-foreground mt-1">Update your photo and personal details.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div>
            <Label className="text-[13px] font-medium">Photo</Label>
            <div className="mt-3 flex items-start gap-5">
              <div className="relative group">
                <div className="h-24 w-24 rounded-xl border-2 border-border/40 overflow-hidden bg-muted/30">
                  {preview ? (
                    <img src={preview} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User size={28} className="text-muted-foreground/40" strokeWidth={1.5} />
                    </div>
                  )}
                </div>

                {(preview || selectedFile) && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-destructive/90"
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <label htmlFor="avatar-upload">
                  <Button type="button" variant="outline" size="sm" className="rounded-xl h-9 gap-2 cursor-pointer" asChild>
                    <span>
                      <Camera size={14} />
                      Change photo
                    </span>
                  </Button>
                </label>
                <p className="text-[11px] text-muted-foreground/70">JPG, PNG or GIF. Max 20MB.</p>
                {errors.avatar && <p className="text-[12px] text-destructive">{errors.avatar.message}</p>}
              </div>
            </div>
          </div>

          <Separator className="bg-border/40" />

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[13px] font-medium">
              Name
            </Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                <User size={15} className="text-muted-foreground/60" strokeWidth={1.5} />
              </div>
              <Input
                id="name"
                {...register("name")}
                className="pl-10 h-10 rounded-xl bg-muted/30 border-border/40 text-[13px] placeholder:text-muted-foreground/40"
                placeholder="Your full name"
              />
            </div>
            {errors.name && <p className="text-[12px] text-destructive">{errors.name.message}</p>}
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[13px] font-medium">
              Username
            </Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                <AtSign size={15} className="text-muted-foreground/60" strokeWidth={1.5} />
              </div>
              <Input
                id="username"
                {...register("username")}
                className="pl-10 h-10 rounded-xl bg-muted/30 border-border/40 text-[13px] placeholder:text-muted-foreground/40"
                placeholder="your-username"
              />
            </div>
            {errors.username && <p className="text-[12px] text-destructive">{errors.username.message}</p>}
          </div>

          {/* Mobile Field */}
          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-[13px] font-medium">
              Mobile <span className="text-muted-foreground/50 font-normal">(optional)</span>
            </Label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                <Phone size={15} className="text-muted-foreground/60" strokeWidth={1.5} />
              </div>
              <Input
                id="mobile"
                {...register("mobile")}
                className="pl-10 h-10 rounded-xl bg-muted/30 border-border/40 text-[13px] placeholder:text-muted-foreground/40"
                placeholder="+91 98765 43210"
              />
            </div>
            {errors.mobile && <p className="text-[12px] text-destructive">{errors.mobile.message}</p>}
          </div>

          {/* Error Message */}
          {errors.root && (
            <div className="px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/20">
              <ErrorMessage error={errors.root.message} />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              className="rounded-xl h-10 text-[13px] text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>

            <Button type="submit" variant="outline" disabled={isPending || !isDirty} className="rounded-xl h-10 px-6 gap-2 min-w-35">
              {isPending ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditProfileSkeleton = () => (
  <div className="px-4 py-6 md:px-8 md:py-8 max-w-175 mx-auto">
    {/* Back button skeleton */}
    <Skeleton className="h-4 w-24 mb-6" />

    {/* Card skeleton */}
    <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      {/* Header skeleton */}
      <div className="px-6 py-5 border-b border-border/30">
        <Skeleton className="h-6 w-28 mb-1.5" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Form skeleton */}
      <div className="p-6 space-y-6">
        {/* Avatar section */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-12" />
          <div className="flex items-start gap-5">
            <Skeleton className="h-24 w-24 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-9 w-32 rounded-xl" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        </div>

        <Skeleton className="h-px w-full" />

        {/* Name field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        {/* Username field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        {/* Mobile field */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-10 w-20 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default EditProfile;
