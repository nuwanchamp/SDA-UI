"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { API_BASE_URL, AUTH_COOKIE_NAME, IS_API_MOCKING_ENABLED } from "@/lib/constants";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormState = {
  success: boolean;
  error?: string;
};

export async function loginUser(
  values: z.infer<typeof formSchema>
): Promise<FormState> {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields" };
  }
  
  const { email, password } = validatedFields.data;

  if (IS_API_MOCKING_ENABLED) {
    if (email === "demo@example.com" && password === "password") {
        cookies().set(AUTH_COOKIE_NAME, "mock_token_generic", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });
        return { success: true };
    } else {
        return { success: false, error: "Invalid credentials for demo account." };
    }
  }

  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  try {
    const response = await fetch(`${API_BASE_URL}/token`, {
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

    const data = await response.json();
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
    return { success: false, error: "An unexpected error occurred." };
  }
}
