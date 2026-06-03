import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWorkspaceSchema, type CreateWorkspaceInput } from "../validations/workspace.validations";
import { useEffect, useState } from "react";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { setFormErrors } from "@/shared/utils/errorHandler";

type WorkspaceFormProps = {
  onSubmit: (data: FormData) => Promise<unknown>;
  defaultValues?: {
    name?: string;
    description?: string;
    logo?: string;
  };
  submitLabel?: string;
  loading: boolean;
};

const WorkspaceForm = ({ onSubmit, defaultValues, submitLabel = "Create workspace", loading }: WorkspaceFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      logo: undefined,
    },
  });

  // Existing logo URL se preview
  const [preview, setPreview] = useState<string | null>(defaultValues?.logo || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(file));
    setValue("logo", file);
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
    <form onSubmit={handleSubmit(handler)} className="space-y-4 pt-1">
      {/* name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">
          Workspace name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="My Workspace"
          disabled={loading}
          {...register("name")}
          className={`bg-card ${errors.name ? "border-destructive" : ""}`}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">
          Description <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <textarea
          id="description"
          {...register("description")}
          disabled={loading}
          rows={3}
          placeholder="What is this workspace for?"
          className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 resize-none ${
            errors.description ? "border-destructive" : ""
          }`}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      {/* logo */}
      <div className="w-24">
        <input id="logo" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <label htmlFor="logo" className="cursor-pointer">
          {preview ? (
            <img src={preview} className="h-24 w-24 object-cover rounded-xl" />
          ) : (
            <div className="h-24 border border-dashed flex justify-center items-center rounded-xl hover:bg-muted/50 transition-colors">
              <CloudUpload size={20} className="text-muted-foreground" />
            </div>
          )}
        </label>
      </div>

      {errors.root && <ErrorMessage error={errors.root.message} />}

      {/* actions */}
      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={loading}
          onClick={() => {
            reset();
            setPreview(defaultValues?.logo || null);
          }}
        >
          Cancel
        </Button>
        <Button variant="outline" type="submit" className="flex-1" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Loading…
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
