import axios, { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";

import { ApiError } from ".";

interface ErrorResponse {
  error?: string;
  message?: string;
}

export const handleApiError = (error: AxiosError): ApiError => {
  const responseData = error.response?.data as ErrorResponse;
  return {
    error: responseData?.error || "Unknown error",
    message: responseData?.message || error.message || "Something went wrong",
  };
};

export const makeRequest = async <T>(
  requestFn: () => Promise<AxiosResponse>,
  schema: z.ZodSchema<T>
): Promise<T> => {
  try {
    const response = await requestFn();
    const validation = schema.safeParse(response.data);
    if (validation.success) {
      return validation.data;
    } else {
      const validationErrorMessage = validation.error.errors
        .map((e) => e.message)
        .join(", ");
      throw new Error(
        `API response validation failed: ${validationErrorMessage}`
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw handleApiError(error);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
