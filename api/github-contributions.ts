import { getGithubContributions } from "../src/utils/githubData.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const forceRefresh = req.query?.refresh === "true";
  const data = await getGithubContributions(forceRefresh);
  // Let Vercel's CDN serve this for an hour so GitHub isn't hit on every visit.
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).json(data);
}
