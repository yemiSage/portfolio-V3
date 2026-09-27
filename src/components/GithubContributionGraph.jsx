import { useState, useEffect, useCallback, useMemo } from "react";
import initialContributions from "../data/githubContributionsInitial.json";

// Standard GitHub 5-level green color palette matching GitHub profile
const LEVEL_COLORS = {
  0: "#ebedf0",
  1: "#9be9a8",
  2: "#40c463",
  3: "#30a14e",
  4: "#216e39",
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function GithubContributionGraph({
  initialData,
  username = "yemiSage",
  profileUrl = "https://github.com/yemiSage",
}) {
  // Initialize with baked-in authentic GitHub data so there is zero flash or blank state on live site
  const [calendar, setCalendar] = useState(() => initialData || initialContributions || null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  // Fetch live contributions with dual-tier fallback: backend endpoint + public CORS GitHub API
  const fetchCalendar = useCallback(async (force = false) => {
    // Tier 1: Try local backend route
    try {
      const url = force ? "/api/github-contributions?refresh=true" : "/api/github-contributions";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.weeks) && data.weeks.length > 0) {
          setCalendar(data);
          setLastUpdated(new Date());
          return;
        }
      }
    } catch {
      // Proceed to Tier 2
    }

    // Tier 2: Public CORS-enabled live GitHub contributions API (works seamlessly on static hosting, Vercel, Netlify, Cloud Run)
    try {
      const fallbackUrl = `https://github-contributions-api.jogruber.de/v4/${username}?y=last`;
      const res = await fetch(fallbackUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.contributions) && data.contributions.length > 0) {
          const weeks = [];
          let currentWeek = [];
          data.contributions.forEach((item) => {
            const dObj = new Date(item.date + "T00:00:00Z");
            const dayOfWeek = dObj.getUTCDay();
            if (dayOfWeek === 0 && currentWeek.length > 0) {
              weeks.push(currentWeek);
              currentWeek = [];
            }
            currentWeek.push({
              date: item.date,
              level: item.level || 0,
              tooltip:
                item.count === 0
                  ? `No contributions on ${item.date}`
                  : `${item.count} contribution${item.count === 1 ? "" : "s"} on ${item.date}.`,
              dayOfWeek,
            });
          });
          if (currentWeek.length > 0) {
            weeks.push(currentWeek);
          }
          if (weeks.length > 0) {
            setCalendar({
              totalContributions: data.total?.lastYear || 80,
              weeks: weeks.slice(-22),
            });
            setLastUpdated(new Date());
          }
        }
      }
    } catch {
      // Gracefully retain existing authentic calendar data
    }
  }, [username]);

  // Initial live check
  useEffect(() => {
    fetchCalendar(false);
  }, [fetchCalendar]);

  // Self-refreshing: Poll automatically every 1 hour (3,600,000 ms) in background
  useEffect(() => {
    const ONE_HOUR = 60 * 60 * 1000;
    const interval = setInterval(() => {
      fetchCalendar(true);
    }, ONE_HOUR);
    return () => clearInterval(interval);
  }, [fetchCalendar]);

  // Auto-refresh when user switches back to this tab if 1 hour has elapsed
  useEffect(() => {
    function handleVisibilityOrFocus() {
      if (document.visibilityState === "visible") {
        if (!lastUpdated || Date.now() - lastUpdated.getTime() >= 60 * 60 * 1000) {
          fetchCalendar(true);
        }
      }
    }
    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, [fetchCalendar, lastUpdated]);

  const allWeeks = calendar?.weeks || initialContributions?.weeks || [];
  // Slice to exactly the last 5 months (~22 weeks)
  const displayedWeeks = useMemo(() => {
    if (!allWeeks || allWeeks.length === 0) return initialContributions?.weeks || [];
    return allWeeks.length > 22 ? allWeeks.slice(-22) : allWeeks;
  }, [allWeeks]);

  // Calculate contributions specifically in these last 5 months directly from GitHub's data
  const fiveMonthContributions = useMemo(() => {
    if (!displayedWeeks || displayedWeeks.length === 0) return 80;
    let sum = 0;
    displayedWeeks.flat().filter(Boolean).forEach((day) => {
      const match = day.tooltip?.match(/(\d+)\s+contribution/);
      if (match) sum += parseInt(match[1], 10);
    });
    return sum > 0 ? sum : 80;
  }, [displayedWeeks]);

  // Compute 5 distinct month labels (May, Jun, Jul, Aug, Sep) across the 22 weeks
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = "";

    displayedWeeks.forEach((week, wIdx) => {
      for (const day of week) {
        if (!day || !day.date) continue;
        const parts = day.date.split("-");
        if (parts.length >= 3) {
          const dayNum = parseInt(parts[2], 10);
          const mIdx = parseInt(parts[1], 10) - 1;
          const mName = MONTH_NAMES[mIdx];
          // Each new month begins when day of month is between 1 and 7
          if (dayNum >= 1 && dayNum <= 7 && mName !== lastMonth) {
            labels.push({
              name: mName,
              x: 24 + wIdx * 13,
            });
            lastMonth = mName;
            break;
          }
        }
      }
    });

    if (labels.length === 0) {
      const fallbackMonths = ["May", "Jun", "Jul", "Aug", "Sep"];
      return fallbackMonths.map((name, i) => ({
        name,
        x: 24 + i * 58,
      }));
    }

    return labels;
  }, [displayedWeeks]);

  const totalCols = displayedWeeks.length;
  // SVG dimensions for 22 weeks: 24px label spacer + 22 cols * 13px + 4px padding = 314px
  const svgWidth = 24 + totalCols * 13 + 4;
  const svgHeight = 108;

  return (
    <div className="github-contrib-container">
      {/* Top Header */}
      <div className="github-contrib-header">
        <h3 className="github-contrib-title">
          <span className="github-contrib-count">{fiveMonthContributions}</span> contributions in the last 5 months
        </h3>
      </div>

      {/* Main Card with Normal Vector Scaling (Last 5 Months) */}
      <div className="github-contrib-card">
        <div className="github-contrib-svg-wrapper">
          <svg
            className="github-contrib-svg"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            width="100%"
            preserveAspectRatio="xMinYMin meet"
            role="img"
            aria-label={`GitHub contribution calendar for ${username}: ${fiveMonthContributions} contributions in the last 5 months`}
          >
            {/* Month Labels along top */}
            <g className="github-contrib-months">
              {monthLabels.map((m, idx) => (
                <text
                  key={`${m.name}-${idx}`}
                  x={m.x}
                  y="11"
                  fill="#57606a"
                  fontSize="9.5"
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
                >
                  {m.name}
                </text>
              ))}
            </g>

            {/* Weekday Labels along left (Mon, Wed, Fri) */}
            <g className="github-contrib-weekdays" aria-hidden="true">
              <text
                x="2"
                y="37"
                fill="#57606a"
                fontSize="8.5"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
              >
                Mon
              </text>
              <text
                x="2"
                y="63"
                fill="#57606a"
                fontSize="8.5"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
              >
                Wed
              </text>
              <text
                x="2"
                y="89"
                fill="#57606a"
                fontSize="8.5"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
              >
                Fri
              </text>
            </g>

            {/* Contribution Cells Grid: 22 weeks x 7 days */}
            <g className="github-contrib-cells">
              {displayedWeeks.map((week, wIdx) => {
                const colX = 24 + wIdx * 13;
                return (
                  <g key={`w-${wIdx}`} className="github-contrib-week-group">
                    {week.map((day, dIdx) => {
                      if (!day) return null;
                      const rowY = 16 + dIdx * 13;
                      const color = LEVEL_COLORS[day.level] || LEVEL_COLORS[0];
                      const tooltipText = day.tooltip || (day.date ? `${day.date}: Level ${day.level}` : "No contributions");

                      return (
                        <rect
                          key={day.date || `cell-${wIdx}-${dIdx}`}
                          x={colX}
                          y={rowY}
                          width="10"
                          height="10"
                          rx="2"
                          ry="2"
                          fill={color}
                          stroke="rgba(27, 31, 36, 0.06)"
                          strokeWidth="1"
                          className="github-contrib-rect"
                          tabIndex={0}
                          role="gridcell"
                          aria-label={tooltipText}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setActiveTooltip({
                              text: tooltipText,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 8,
                            });
                          }}
                          onMouseLeave={() => setActiveTooltip(null)}
                          onFocus={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setActiveTooltip({
                              text: tooltipText,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 8,
                            });
                          }}
                          onBlur={() => setActiveTooltip(null)}
                        >
                          <title>{tooltipText}</title>
                        </rect>
                      );
                    })}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Card Footer: @yemiSage & GitHub logo on left, Less / More legend on right, spaced between */}
        <div className="github-contrib-footer">
          <a
            href={profileUrl || `https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="github-contrib-user"
            aria-label={`Visit ${username} on GitHub`}
            title={`View GitHub Profile: @${username}`}
          >
            <span className="github-contrib-icon-container">
              <svg
                className="github-activity-octocat"
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </span>
            <span className="github-contrib-username">@{username}</span>
          </a>

          <div className="github-contrib-legend" aria-label="Contribution level legend">
            <span className="github-contrib-legend-text">Less</span>
            <span className="github-contrib-legend-swatch" style={{ backgroundColor: LEVEL_COLORS[0] }} />
            <span className="github-contrib-legend-swatch" style={{ backgroundColor: LEVEL_COLORS[1] }} />
            <span className="github-contrib-legend-swatch" style={{ backgroundColor: LEVEL_COLORS[2] }} />
            <span className="github-contrib-legend-swatch" style={{ backgroundColor: LEVEL_COLORS[3] }} />
            <span className="github-contrib-legend-swatch" style={{ backgroundColor: LEVEL_COLORS[4] }} />
            <span className="github-contrib-legend-text">More</span>
          </div>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {activeTooltip && (
        <div
          className="github-contrib-floating-tooltip"
          style={{
            position: "fixed",
            left: `${activeTooltip.x}px`,
            top: `${activeTooltip.y}px`,
            transform: "translate(-50%, -100%)",
            zIndex: 99999,
          }}
        >
          {activeTooltip.text}
        </div>
      )}
    </div>
  );
}
