import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
};

const IssueForm = ({ onSubmit, defaultValues, submitLabel = "Create Issue", loading }: IssueFormProps) => {
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
    <form onSubmit={handleSubmit(handler)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Fix authentication bug"
          disabled={loading}
          {...register("title")}
          className={`bg-card ${errors.title ? "border-destructive" : ""}`}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={4}
          disabled={loading}
          placeholder="Describe the issue..."
          {...register("description")}
          className={`bg-card flex w-full rounded-md border border-input px-3 py-2 text-sm resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${
            errors.description ? "border-destructive" : ""
          }`}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Priority</Label>
        <Controller
          control={control}
          name="priority"
          render={({ field }) => (
            <Select defaultValue={field.value} onValueChange={field.onChange} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.priority && <p className="text-xs text-destructive">{errors.priority.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Assign To</Label>
        <Controller
          control={control}
          name="assignedTo"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members?.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member?.user?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.assignedTo && <p className="text-xs text-destructive">{errors.assignedTo.message}</p>}
      </div>

      {errors.root && <ErrorMessage error={errors.root.message} />}

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1" disabled={loading} onClick={() => reset()}>
          Cancel
        </Button>
        <Button variant="outline" type="submit" className="flex-1" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Loading...
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
