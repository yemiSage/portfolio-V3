import { useEffect, useState } from "react";
import GithubContributionGraph from "./GithubContributionGraph";

// Default stats computed directly from Opeyemi Adegboye's GitHub profile (@yemiSage)
const DEFAULT_STATS = {
  username: "yemiSage",
  name: "Adegboye Opeyemi",
  profileUrl: "https://github.com/yemiSage",
};

export default function GithubStats() {
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const res = await fetch("/api/github-stats");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data) {
            setStats((prev) => ({
              ...prev,
              ...data,
            }));
          }
        }
      } catch {
        // Fallback to default stats gracefully
      }
    }
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="github-activity-margin">
      {/* GitHub Live Contribution Heatmap Calendar (Last 5 Months) */}
      <GithubContributionGraph
        initialData={stats.contributionCalendar}
        username={stats.username}
        profileUrl={stats.profileUrl}
      />
    </div>
  );
}
