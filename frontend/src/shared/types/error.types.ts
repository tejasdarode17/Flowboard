export interface ApiFieldError {
    field: string;
    message: string;
}

export interface ApiErrorResponse {
    success: boolean;
    message: string;
    code: string;
    errors?: ApiFieldError[];
}
