import { ChatClient } from "@/components/chat-client";
import { getHistory } from "./actions";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

export default async function ChatPage() {
  const initialHistory = await getHistory();
  const token = cookies().get(AUTH_COOKIE_NAME)?.value;
  const isGuest = token === "mock_token_guest";

  return <ChatClient initialHistory={initialHistory} isGuest={isGuest} />;
}
