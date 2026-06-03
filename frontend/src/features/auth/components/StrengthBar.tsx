import { getStrength } from "@/features/auth/utils/passwordStrength";

interface StrengthBarProps {
  password: string;
  errors: Record<string, string>;
}

const StrengthBar = ({ password, errors }: StrengthBarProps) => {
  const strength = getStrength(password);
  return (
    <div>
      {password && !errors?.password?.length && (
        <div className="mt-2 space-y-1.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength?.score ? strength?.color : "bg-border"}`}
              />
            ))}
          </div>
          {strength?.label && (
            <p
              className={`text-xs ${
                strength?.score === 1
                  ? "text-red-500"
                  : strength?.score === 2
                    ? "text-amber-500"
                    : strength?.score === 3
                      ? "text-blue-500"
                      : "text-emerald-600"
              }`}
            >
              {strength?.label} password
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StrengthBar;
