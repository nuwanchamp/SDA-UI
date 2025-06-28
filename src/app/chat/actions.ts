"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { API_BASE_URL, AUTH_COOKIE_NAME, IS_API_MOCKING_ENABLED } from "@/lib/constants";
import type { HistoryItem, Document } from "@/lib/types";
async function getAuthToken() {
  return cookies().get(AUTH_COOKIE_NAME)?.value;
}

export async function getHistory(): Promise<HistoryItem[]> {
  const token = await getAuthToken();
  if (!token) return [];

  if (IS_API_MOCKING_ENABLED) {
    return Promise.resolve([
      { id: 1, document_id: 101, question: "What is the main theme of the document?", answer: "The document discusses the future of renewable energy.", created_at: new Date().toISOString() },
      { id: 2, document_id: 101, question: "What are the key takeaways?", answer: "Solar and wind power are leading the charge.", created_at: new Date().toISOString() },
      { id: 3, document_id: 102, question: "How does the mock API work?", answer: "It returns pre-defined data without calling a real server.", created_at: new Date().toISOString() },
    ]);
  }

  try {
    const response = await fetch(`http://${API_BASE_URL}/history`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return [];
  }
}

export async function uploadDocument(formData: FormData): Promise<{ success: boolean; document?: Document; error?: string }> {
  const token = await getAuthToken();
  if (!token) return { success: false, error: "Unauthorized" };

  const file = formData.get("file") as File;
  if (!file) return { success: false, error: "No file provided" };

  if (IS_API_MOCKING_ENABLED) {
    const newDoc = {
      id: Math.floor(Math.random() * 1000) + 1,
      filename: file.name,
      mime_type: file.type,
      file_size: file.size,
      uploaded_at: new Date().toISOString(),
    };
    revalidatePath('/chat');
    return { success: true, document: newDoc };
  }

  try {
    const response = await fetch(`http://${API_BASE_URL}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.detail || "Upload failed" };
    }

    revalidatePath('/chat');
    return { success: true, document: result };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function askQuestion(documentId: number, question: string): Promise<{ success: boolean; answer?: string; error?: string }> {
  const token = await getAuthToken();
  if (!token) return { success: false, error: "Unauthorized" };

  if (IS_API_MOCKING_ENABLED) {
    revalidatePath('/chat');
    // Simulate a delay for a more realistic feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, answer: `This is a mocked answer for document ${documentId} to your question: "${question}"` };
  }

  try {

    const response = await fetch(`http://${API_BASE_URL}/ask`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ document_id: documentId, question: question }),
    });

    const result = await response.json();
    if (!response.ok) {
      return { success: false, error: result.detail || "Failed to get answer" };
    }

    revalidatePath('/chat');
    return { success: true, answer: result.answer };
  } catch (error) {
    console.error("Ask question error:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}

export async function logout() {
  cookies().delete(AUTH_COOKIE_NAME);
  redirect("/login");
}
