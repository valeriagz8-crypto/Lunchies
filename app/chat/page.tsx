import { Suspense } from "react";
import ChatClient from "./ChatClient";

// The conversation lives in client state and talks to Supabase from the
// browser, so there is nothing useful to prerender.
export const dynamic = "force-dynamic";

export default function ChatPage() {
  return (
    <Suspense>
      <ChatClient />
    </Suspense>
  );
}
