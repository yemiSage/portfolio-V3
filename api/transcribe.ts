import { handleTranscribeWebRequest } from "../src/utils/transcribe.js";

// Web-standard handlers, like api/chat.ts. The body is the raw audio recording.

export function GET() {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(request: Request) {
  return handleTranscribeWebRequest(request);
}
