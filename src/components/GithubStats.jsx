import { useEffect, useState } from "react";
import GithubContributionGraph from "./GithubContributionGraph";

// Default stats computed directly from Opeyemi Adegboye's GitHub profile (@yemiSage)
const DEFAULT_STATS = {
  username: "yemiSage",
  name: "Adegboye Opeyemi",
  profileUrl: "https://github.com/yemiSage",
  projectsShipped: 2,
  totalProjects: 5,
  commitsThisYear: 77,
  prs: 0,
  contributions: 78,
  year: 2026,
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
      <div className="github-activity-card">
        {/* GitHub 4-col statistics row */}
        <div className="github-activity-stats-row" role="group" aria-label="GitHub statistics">
          {/* Projects Shipped */}
          <div className="github-activity-stat-col stat-col-shipped">
            <span className="github-activity-stat-value">{stats.projectsShipped}</span>
            <span className="github-activity-stat-label">Projects Shipped</span>
          </div>

          {/* Projects */}
          <div className="github-activity-stat-col stat-col-projects">
            <span className="github-activity-stat-value">{stats.totalProjects}</span>
            <span className="github-activity-stat-label">Projects</span>
          </div>

          {/* Commits */}
          <div className="github-activity-stat-col stat-col-commits">
            <span className="github-activity-stat-value">{stats.commitsThisYear}</span>
            <span className="github-activity-stat-label">Commits</span>
          </div>

          {/* Contributions */}
          <div className="github-activity-stat-col stat-col-contributions">
            <span className="github-activity-stat-value">
              {stats.contributions !== undefined ? stats.contributions : 78}
            </span>
            <span className="github-activity-stat-label">Contributions</span>
          </div>
        </div>
      </div>

      {/* GitHub Live Contribution Heatmap Calendar (Last 5 Months) */}
      <GithubContributionGraph
        initialData={stats.contributionCalendar}
        username={stats.username}
        profileUrl={stats.profileUrl}
      />
    </div>
  );
}
