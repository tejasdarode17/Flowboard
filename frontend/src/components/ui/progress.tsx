import { cn } from "@/lib/utils";

type ProgressProps = {
  value?: number;
  className?: string;
  indicatorClassName?: string;
};

function Progress({ value = 0, className, indicatorClassName }: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("relative h-2.5 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className={cn("h-full rounded-full bg-primary transition-all", indicatorClassName)}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}

export { Progress };
