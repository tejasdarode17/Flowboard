import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EmojiPicker from "emoji-picker-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { setFormErrors } from "@/shared/utils/errorHandler";
import { createProjectSchema, type CreateProjectInput } from "../../projects/validations/project.validations";
import type { Project } from "../types/project.types";

type ProjectFormProps = {
  onSubmit: (data: CreateProjectInput) => Promise<unknown>;
  loading: boolean;
  project?: Project;
  onClose: () => void;
};

const ProjectForm = ({ onSubmit, loading, project, onClose }: ProjectFormProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(project?.emoji ?? "🚀");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      emoji: project?.emoji || "🚀",
      emojiId: project?.emojiId || "rocket",
    },
  });

  const handler = async (data: CreateProjectInput) => {
    try {
      await onSubmit(data);
      reset();
      setShowPicker(false);
    } catch (error) {
      setFormErrors(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(handler)} className="space-y-5 pt-1">
      {/* Project Name + Emoji */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-[13px] font-medium">
          Project name <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-2.5 items-start relative">
          {/* Emoji Picker Button */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowPicker((prev) => !prev)}
              className="h-10 w-10 flex items-center justify-center rounded-lg border border-input bg-card text-xl hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {selectedEmoji}
            </button>
            {showPicker && (
              <div className="absolute top-12 left-0 z-50 shadow-lg rounded-xl overflow-hidden">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    setValue("emoji", emojiData.emoji);
                    setValue("emojiId", emojiData.names[0]);
                    setShowPicker(false);
                    setSelectedEmoji(emojiData.emoji);
                  }}
                  className="bg-background"
                  height={380}
                  width={300}
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}
          </div>
          {/* Name Input */}
          <div className="flex-1">
            <Input
              id="name"
              placeholder="Website Redesign"
              disabled={loading}
              {...register("name")}
              className={`h-10 rounded-xl bg-muted/30 border-border/40 text-[13px] placeholder:text-muted-foreground/40 ${
                errors.name ? "border-red-500/40 focus-visible:ring-red-500/20" : ""
              }`}
            />
            {errors.name && <p className="text-[12px] text-destructive mt-1.5">{errors.name.message}</p>}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-[13px] font-medium">
          Description <span className="text-muted-foreground/50 font-normal">(optional)</span>
        </Label>
        <textarea
          id="description"
          rows={3}
          disabled={loading}
          placeholder="What is this project about?"
          {...register("description")}
          className={`flex w-full rounded-xl border border-border/40 bg-muted/30 px-3.5 py-2.5 text-[13px] placeholder:text-muted-foreground/40 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-border/60 disabled:opacity-50 transition-all duration-150 ${
            errors.description ? "border-red-500/40" : ""
          }`}
        />
        {errors.description && <p className="text-[12px] text-destructive mt-1.5">{errors.description.message}</p>}
      </div>

      {/* Error */}
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
            setShowPicker(false);
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button variant="outline" type="submit" className="flex-1 rounded-xl h-10 text-[13px] gap-2" disabled={loading || !isDirty}>
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {project ? "Saving..." : "Creating..."}
            </>
          ) : project ? (
            "Save Changes"
          ) : (
            "Create Project"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
