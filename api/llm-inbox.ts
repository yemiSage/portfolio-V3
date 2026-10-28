import { handleInboxRequest } from "../src/utils/llmInbox.mjs";

export function GET(request: Request) {
  return handleInboxRequest(request);
}
