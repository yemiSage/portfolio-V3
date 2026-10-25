import { handleGuestbookRequest } from "../src/utils/guestbook.mjs";

export default async function handler(req: any, res: any) {
  const headers = new Headers();
  for (const name of ["origin", "content-type", "content-length", "x-forwarded-for"]) {
    if (typeof req.headers[name] === "string") headers.set(name, req.headers[name]);
  }
  const response = await handleGuestbookRequest(new Request("https://portfolio.internal/api/guestbook", {
    method: req.method, headers,
    ...(!["GET", "HEAD"].includes(req.method) ? { body: JSON.stringify(req.body) } : {}),
  }));
  response.headers.forEach((value, name) => res.setHeader(name, value));
  res.status(response.status).send(await response.text());
}
