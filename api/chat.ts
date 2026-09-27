import { handleChatWebRequest } from "../src/utils/chatEngine.js";

// Web-standard handlers: Vercel streams the returned Response to the browser as it is generated.
// No CORS headers: the chat is only meant to be called from the portfolio itself.

export function GET() {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(request: Request) {
  return handleChatWebRequest(request);
}
