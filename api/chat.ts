import { handleChatWebRequest } from "../src/utils/chatEngine.js";

// Web-standard handlers: Vercel streams the returned Response to the browser as it is generated.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export function GET() {
  return Response.json({ error: "Method not allowed" }, { status: 405, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  return handleChatWebRequest(request, CORS_HEADERS);
}
