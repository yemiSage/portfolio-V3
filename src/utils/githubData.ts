// Shared GitHub data helpers used by the Express dev server (server.ts)
// and the Vercel serverless functions in api/.

const GITHUB_USERNAME = "yemiSage";
const CACHE_TTL = 60 * 60 * 1000;

// In-memory caches (TTL: 1 hour). On Vercel these only live as long as a
// warm function instance, so the API routes also set CDN cache headers.
let githubCache: { data: any; timestamp: number } | null = null;
let githubContributionsCache: { data: any; timestamp: number } | null = null;

export const DEFAULT_GITHUB_STATS = {
  username: "yemiSage",
  name: "Adegboye Opeyemi",
  profileUrl: "https://github.com/yemiSage",
  avatarUrl: "https://avatars.githubusercontent.com/u/114894864?v=4",
  bio: "UI/UX Designer | Framer Developer",
  projectsShipped: 2,
  prs: 0,
  commitsThisYear: 77,
  contributions: 78,
  totalProjects: 5,
  year: 2026,
  followers: 10,
  following: 11,
  publicGists: 5,
  topLanguages: ["TypeScript", "JavaScript", "HTML"],
  featuredRepos: [
    {
      name: "PHA_WebApp",
      url: "https://github.com/yemiSage/PHA_WebApp",
      demo: "https://pha-pi.vercel.app",
      description: "Web application for Product Hub Africa",
      language: "TypeScript",
      isShipped: true,
    },
    {
      name: "portfolio-V3",
      url: "https://github.com/yemiSage/portfolio-V3",
      demo: "https://yemii.vercel.app",
      description: "Official portfolio website built with modern React",
      language: "JavaScript",
      isShipped: true,
    },
    {
      name: "soludesks",
      url: "https://github.com/yemiSage/soludesks",
      demo: null,
      description: "Modern productivity and workspace application",
      language: "TypeScript",
      isShipped: false,
    },
  ],
};

export async function fetchContributionsData(username = GITHUB_USERNAME) {
  try {
    const res = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: { "User-Agent": "yemi-portfolio" },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const countMatch = html.match(/([\d,]+)\s+contributions\s+in the last year/i);
    const totalContributions = countMatch ? parseInt(countMatch[1].replace(/,/g, ""), 10) : 78;

    const thead = html.match(/<thead>[\s\S]*?<\/thead>/);
    const months: Array<{ name: string; colspan: number }> = [];
    if (thead) {
      for (const m of thead[0].matchAll(/<td[^>]*colspan="(\d+)"[^>]*>[\s\S]*?<span aria-hidden="true"[^>]*>([A-Za-z]+)<\/span>/g)) {
        months.push({ name: m[2], colspan: parseInt(m[1], 10) });
      }
    }

    const tooltipMap = new Map<string, string>();
    for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g)) {
      tooltipMap.set(m[1], m[2].trim());
    }

    const tbody = html.match(/<tbody>[\s\S]*?<\/tbody>/);
    if (!tbody) return { totalContributions, months, weeks: [] };

    const rowMatches = [...tbody[0].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)];
    const rows = rowMatches.map((tr, dayOfWeek) => {
      const tds = [...tr[1].matchAll(/<td([^>]*)>/g)];
      const days: any[] = [];
      for (const td of tds) {
        const raw = td[1];
        const dateMatch = raw.match(/data-date="([^"]+)"/);
        if (!dateMatch) continue;
        const date = dateMatch[1];
        const levelMatch = raw.match(/data-level="([^"]+)"/);
        const level = levelMatch ? parseInt(levelMatch[1], 10) : 0;
        const idMatch = raw.match(/id="([^"]+)"/);
        const id = idMatch ? idMatch[1] : "";
        const tooltip = tooltipMap.get(id) || "";
        days.push({ date, level, tooltip, dayOfWeek });
      }
      return days;
    });

    const colCount = Math.max(...rows.map((r) => r.length));
    const weeks: any[][] = [];
    for (let c = 0; c < colCount; c++) {
      const week: any[] = [];
      for (let r = 0; r < 7; r++) {
        week.push(rows[r][c] || null);
      }
      weeks.push(week);
    }

    return {
      totalContributions,
      months,
      weeks,
    };
  } catch (err) {
    console.warn("[github-contributions] Error fetching contributions calendar:", err);
    return null;
  }
}

export async function getGithubStats() {
  const now = Date.now();
  if (githubCache && now - githubCache.timestamp < CACHE_TTL) {
    return githubCache.data;
  }

  try {
    const headers: Record<string, string> = {
      "User-Agent": "yemi-portfolio",
      Accept: "application/vnd.github.v3+json",
    };

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`, { headers }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return githubCache?.data || DEFAULT_GITHUB_STATS;
    }

    const userData = (await userRes.json()) as any;
    const reposData = (await reposRes.json()) as any[];

    let projectsShipped = 0;
    const languagesSet = new Set<string>();

    if (Array.isArray(reposData)) {
      for (const repo of reposData) {
        if (repo.homepage && repo.homepage.trim().length > 0) {
          projectsShipped++;
        }
        if (repo.language) {
          languagesSet.add(repo.language);
        }
      }
    }

    // Ensure at least 2 shipped based on live production sites
    if (projectsShipped < 2) {
      projectsShipped = 2;
    }

    let commitsThisYear = 70;
    try {
      const commitRes = await fetch(
        `https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}+author-date:>=2026-01-01`,
        {
          headers: {
            ...headers,
            Accept: "application/vnd.github.cloak-preview",
          },
        }
      );
      if (commitRes.ok) {
        const commitData = (await commitRes.json()) as any;
        if (typeof commitData.total_count === "number" && commitData.total_count > 0) {
          commitsThisYear = commitData.total_count;
        }
      }
    } catch {
      // fallback to cached/default commits
    }

    let prs = 0;
    try {
      const prRes = await fetch(`https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:pr`, { headers });
      if (prRes.ok) {
        const prData = (await prRes.json()) as any;
        if (typeof prData.total_count === "number") {
          prs = prData.total_count;
        }
      }
    } catch {
      // fallback to default PRs
    }

    // Fetch live contribution calendar
    const contribData = await fetchContributionsData(userData.login || GITHUB_USERNAME);
    const totalContribs = contribData?.totalContributions || 378;

    const liveData = {
      username: userData.login || "yemiSage",
      name: userData.name || "Adegboye Opeyemi",
      profileUrl: userData.html_url || "https://github.com/yemiSage",
      avatarUrl: userData.avatar_url || "https://avatars.githubusercontent.com/u/114894864?v=4",
      bio: userData.bio || "UI/UX Designer | Framer Developer",
      projectsShipped,
      prs,
      commitsThisYear,
      contributions: totalContribs,
      totalProjects: userData.public_repos || (Array.isArray(reposData) ? reposData.length : 5),
      year: 2026,
      contributionCalendar: contribData,
      followers: userData.followers ?? 10,
      following: userData.following ?? 11,
      publicGists: userData.public_gists ?? 5,
      topLanguages: Array.from(languagesSet),
      featuredRepos: Array.isArray(reposData)
        ? reposData.slice(0, 3).map((r) => ({
            name: r.name,
            url: r.html_url,
            demo: r.homepage || null,
            description: r.description,
            language: r.language,
            isShipped: Boolean(r.homepage && r.homepage.trim().length > 0),
          }))
        : DEFAULT_GITHUB_STATS.featuredRepos,
    };

    githubCache = {
      data: liveData,
      timestamp: now,
    };

    return liveData;
  } catch (error) {
    console.warn("[github-stats] Error fetching GitHub data:", error);
    return DEFAULT_GITHUB_STATS;
  }
}

export async function getGithubContributions(forceRefresh = false) {
  const now = Date.now();

  if (!forceRefresh && githubContributionsCache && now - githubContributionsCache.timestamp < CACHE_TTL) {
    return {
      ...githubContributionsCache.data,
      isCached: true,
      cachedAt: new Date(githubContributionsCache.timestamp).toISOString(),
    };
  }

  const data = await fetchContributionsData(GITHUB_USERNAME);
  if (data) {
    githubContributionsCache = {
      data,
      timestamp: now,
    };
    return {
      ...data,
      isCached: false,
      refreshedAt: new Date(now).toISOString(),
    };
  }

  if (githubContributionsCache?.data) {
    return {
      ...githubContributionsCache.data,
      isCached: true,
    };
  }

  return {
    totalContributions: 78,
    months: [],
    weeks: [],
    isCached: false,
  };
}
