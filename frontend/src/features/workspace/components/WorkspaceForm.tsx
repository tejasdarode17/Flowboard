import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWorkspaceSchema, type CreateWorkspaceInput, type UpdateWorkspaceInput } from "../validations/workspace.validations";
import { useEffect, useState } from "react";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { setFormErrors } from "@/shared/utils/errorHandler";

type WorkspaceFormProps = {
  onSubmit: (data: FormData) => Promise<unknown>;
  defaultValues?: UpdateWorkspaceInput;
  submitLabel?: string;
  loading: boolean;
  onClose?: () => void;
};

const WorkspaceForm = ({ onSubmit, defaultValues, submitLabel = "Create workspace", loading, onClose }: WorkspaceFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      logo: undefined,
    },
  });

  const [preview, setPreview] = useState<string | null>(defaultValues?.logo || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("logo", { message: "Only image files are allowed" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("logo", { message: "File size must be under 5MB" });
      return;
    }
    setPreview(URL.createObjectURL(file));
    setValue("logo", file, { shouldDirty: true, shouldValidate: true });
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handler = async (data: CreateWorkspaceInput) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) formData.append("description", data.description);
    if (data.logo instanceof File) formData.append("logo", data.logo);
    try {
      await onSubmit(formData);
      reset();
      setPreview(null);
    } catch (error) {
      setFormErrors(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(handler)} className="space-y-5 pt-1">
      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="text-[13px] font-medium">Logo</Label>
        <div className="flex items-start gap-5">
          <div className="relative group">
            <div className="h-24 w-24 rounded-xl border-2 border-border/40 overflow-hidden bg-muted/30">
              {preview ? (
                <img src={preview} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Camera size={28} className="text-muted-foreground/40" strokeWidth={1.5} />
                </div>
              )}
            </div>
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setValue("logo", undefined, { shouldDirty: true });
                }}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-destructive/90"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            )}
          </div>
          <div className="space-y-2 pt-0.5">
            <input id="logo" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <label htmlFor="logo">
              <Button type="button" variant="outline" size="sm" className="rounded-xl h-9 gap-2 cursor-pointer text-[13px]" asChild>
                <span>
                  <Camera size={14} strokeWidth={1.5} />
                  {preview ? "Change logo" : "Upload logo"}
                </span>
              </Button>
            </label>
            <p className="text-[11px] text-muted-foreground/60">JPG, PNG or GIF. Max 5MB.</p>
          </div>
        </div>
        {errors.logo && <p className="text-[12px] text-destructive mt-1.5">{errors.logo.message}</p>}
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[13px] font-medium">
          Workspace name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="My Workspace"
          disabled={loading}
          {...register("name")}
          className={`h-10 rounded-xl bg-muted/30 border-border/40 text-[13px] placeholder:text-muted-foreground/40 ${
            errors.name ? "border-red-500/40 focus-visible:ring-red-500/20" : ""
          }`}
        />
        {errors.name && <p className="text-[12px] text-destructive mt-1.5">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-[13px] font-medium">
          Description <span className="text-muted-foreground/50 font-normal">(optional)</span>
        </Label>
        <textarea
          id="description"
          {...register("description")}
          disabled={loading}
          rows={3}
          placeholder="What is this workspace for?"
          className={`flex w-full rounded-xl border border-border/40 bg-muted/30 px-3.5 py-2.5 text-[13px] placeholder:text-muted-foreground/40 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-border/60 disabled:opacity-50 transition-all duration-150 ${
            errors.description ? "border-red-500/40" : ""
          }`}
        />
        {errors.description && <p className="text-[12px] text-destructive mt-1.5">{errors.description.message}</p>}
      </div>

      {/* Root Error */}
      {errors.root && <ErrorMessage error={errors.root.message} />}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-xl h-10 text-[13px]"
          disabled={loading}
          onClick={() => {
            reset();
            setPreview(defaultValues?.logo || null);
            onClose?.();
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="outline"
          className="flex-1 rounded-xl h-10 text-[13px] gap-2"
          disabled={loading || (!!defaultValues && !isDirty)}
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {defaultValues ? "Saving..." : "Creating..."}
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
};

export default WorkspaceForm;
