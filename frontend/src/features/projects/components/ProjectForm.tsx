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

type ProjectFormProps = {
  onSubmit: (data: CreateProjectInput) => Promise<unknown>;
  loading: boolean;
};

const ProjectForm = ({ onSubmit, loading }: ProjectFormProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("🚀");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "", description: "", emoji: "🚀", emojiId: "rocket" },
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
      <div className="space-y-1.5">
        <Label htmlFor="name">
          Project name <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-2 items-start relative">
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
          <div className="flex-1">
            <Input
              id="name"
              placeholder="Website Redesign"
              disabled={loading}
              {...register("name")}
              className={`bg-card ${errors.name ? "border-destructive" : ""}`}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Click the emoji to change the project icon</p>
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">
          Description <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <textarea
          id="description"
          rows={3}
          disabled={loading}
          placeholder="What is this project about?"
          {...register("description")}
          className={`flex w-full rounded-md border border-input bg-card px-3 py-2 text-sm placeholder:text-muted-foreground resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${
            errors.description ? "border-destructive" : ""
          }`}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      {errors.root && <ErrorMessage error={errors.root.message} />}

      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          disabled={loading}
          onClick={() => {
            reset();
            setShowPicker(false);
          }}
        >
          Cancel
        </Button>
        <Button variant="outline" type="submit" className="flex-1" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Creating...
            </>
          ) : (
            "Create Project"
          )}
        </Button>
      </div>
    </form>
  );
};
export default ProjectForm;
