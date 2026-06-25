import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Flag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/shared/components/ErrorMessage";
import { setFormErrors } from "@/shared/utils/errorHandler";
import { createIssueSchema, type CreateIssueInput } from "../validations/issue.validations";
import { useMembers } from "@/features/workspace/hooks/useMembers";
import { useParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type IssueFormProps = {
  onSubmit: (data: CreateIssueInput) => Promise<unknown>;
  defaultValues?: Partial<CreateIssueInput>;
  submitLabel?: string;
  loading: boolean;
  onClose?: () => void;
};

const IssueForm = ({ onSubmit, defaultValues, submitLabel = "Create Issue", loading, onClose }: IssueFormProps) => {
  const { workspaceSlug } = useParams();
  const { data: members } = useMembers(workspaceSlug!);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = useForm<CreateIssueInput>({
    resolver: zodResolver(createIssueSchema),
    defaultValues: defaultValues ?? {
      title: "",
      description: "",
      priority: "Medium",
      assignedTo: "",
    },
  });

  const handler = async (data: CreateIssueInput) => {
    try {
      await onSubmit(data);
      reset({ title: "", description: "", priority: "Medium", assignedTo: "" });
    } catch (error) {
      setFormErrors(error, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(handler)} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-[13px] font-medium">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Fix authentication bug"
          disabled={loading}
          {...register("title")}
          className={`h-10 rounded-xl bg-muted/30 border-border/40 text-[13px] placeholder:text-muted-foreground/40 ${
            errors.title ? "border-red-500/40 focus-visible:ring-red-500/20" : ""
          }`}
        />
        {errors.title && <p className="text-[12px] text-destructive mt-1.5">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-[13px] font-medium">
          Description <span className="text-muted-foreground/50 font-normal">(optional)</span>
        </Label>
        <textarea
          id="description"
          rows={4}
          disabled={loading}
          placeholder="Describe the issue..."
          {...register("description")}
          className={`flex w-full rounded-xl border border-border/40 bg-muted/30 px-3.5 py-2.5 text-[13px] placeholder:text-muted-foreground/40 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-border/60 disabled:opacity-50 transition-all duration-150 ${
            errors.description ? "border-red-500/40" : ""
          }`}
        />
        {errors.description && <p className="text-[12px] text-destructive mt-1.5">{errors.description.message}</p>}
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label className="text-[13px] font-medium">Priority</Label>
        <Controller
          control={control}
          name="priority"
          render={({ field }) => (
            <Select defaultValue={field.value} onValueChange={field.onChange} disabled={loading}>
              <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-border/40 text-[13px]">
                <div className="flex items-center gap-2">
                  <Flag size={14} className="text-muted-foreground" strokeWidth={1.5} />
                  <SelectValue placeholder="Select priority" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="Low" className="text-[13px] rounded-lg">
                  Low
                </SelectItem>
                <SelectItem value="Medium" className="text-[13px] rounded-lg">
                  Medium
                </SelectItem>
                <SelectItem value="High" className="text-[13px] rounded-lg">
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.priority && <p className="text-[12px] text-destructive mt-1.5">{errors.priority.message}</p>}
      </div>

      {/* Assignee */}
      <div className="space-y-2">
        <Label className="text-[13px] font-medium">
          Assign To <span className="text-muted-foreground/50 font-normal">(optional)</span>
        </Label>
        <Controller
          control={control}
          name="assignedTo"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
              <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-border/40 text-[13px]">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-muted-foreground" strokeWidth={1.5} />
                  <SelectValue placeholder="Select member" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {members?.map((member) => (
                  <SelectItem key={member.id} value={member.id} className="text-[13px] rounded-lg">
                    {member?.user?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.assignedTo && <p className="text-[12px] text-destructive mt-1.5">{errors.assignedTo.message}</p>}
      </div>

      {/* Error */}
      {errors.root && (
        <div className="px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/20">
          <ErrorMessage error={errors.root.message} />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 rounded-xl h-10 text-[13px]"
          disabled={loading}
          onClick={() => {
            reset(defaultValues);
            onClose?.();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1 rounded-xl h-10 text-[13px] gap-2 " disabled={loading} variant="outline">
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

export default IssueForm;
