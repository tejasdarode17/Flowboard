import type { ApiFieldError } from "@/shared/types/error.types";
import axios from "axios";
import type { FieldValues, UseFormSetError, Path } from "react-hook-form";
import type { ZodError } from "zod";

export const apiErrors = (error: unknown) => {
    if (!axios.isAxiosError(error)) {
        return { error: "An unexpected error occurred" }
    }
    const apiError = error?.response?.data
    if (apiError?.errors?.length) {
        const fieldErrors: Record<string, string> = {};
        apiError.errors.forEach((err: ApiFieldError) => {
            fieldErrors[err.field] = err.message;
        });
        return fieldErrors
    } else {
        return { error: apiError?.message || "Something Went wrong on server" }
    }
}


export const setFormErrors = <T extends FieldValues>(error: unknown, setError: UseFormSetError<T>) => {
    const err = apiErrors(error);
    if (err.error) {
        setError("root" as Path<T>, { message: err.error });
    } else {
        Object.entries(err).forEach(([field, message]) => {
            setError(field as Path<T>, { message });
        });
    }
};


//this function only used in forntend while parsing see Login.tsx
export const zodErrors = (result: { error: ZodError }) => {
    const fieldErrors: Record<string, string> = {};

    result.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
    });
    
    return fieldErrors;
}