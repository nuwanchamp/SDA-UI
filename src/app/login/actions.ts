"use server";

import * as yup from "yup";
import {cookies} from "next/headers";
import { API_BASE_URL, AUTH_COOKIE_NAME, IS_API_MOCKING_ENABLED } from "@/lib/constants";

const formSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(1).required(),
});

type FormState = {
  success: boolean;
  error?: string;
};

type FormValues = yup.InferType<typeof formSchema>;

export async function loginUser(
  values: FormValues
): Promise<FormState> {
  try {
    const validatedFields = await formSchema.validate(values);
    const { email, password } = validatedFields;

    // If API mocking is enabled, return a mock token
    if (IS_API_MOCKING_ENABLED) {
      const mockToken = "mock_token_" + Math.random().toString(36).substring(2, 15);
      cookies().set(AUTH_COOKIE_NAME, mockToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });
      return { success: true };
    }

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    const response = await fetch(`http://${API_BASE_URL}/token`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.detail || "Login failed." };
    }

    const data = await response.json() as { access_token: string };
    const token = data.access_token;

    if (typeof token !== "string") {
      return { success: false, error: "Invalid token received." };
    }

    cookies().set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { success: false, error: "Invalid fields" };
    }
    if (error instanceof TypeError) {
      return {success: false, error: error.message || "An unexpected error occurred."};
    }
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
