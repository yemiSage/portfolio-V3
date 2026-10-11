// A project shown as a folder: three screenshots tucked behind a solid front panel with
// the project name and an arrow. On hover the screenshots fan out of the folder.
// The SVG shapes share the stage's fixed aspect ratio, so their corners never distort.

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="8 7 17 7 17 16" />
    </svg>
  );
}

export default function ProjectFolder({ project }) {
  const Tag = project.href ? "a" : "article";
  const linkProps = project.href
    ? { href: project.href, target: "_blank", rel: "noopener noreferrer", "aria-label": `View ${project.name} (opens in a new tab)` }
    : {};

  return (
    <Tag className="project-folder" data-cursor="View project" {...linkProps}>
      <div className="folder-stage">
        <svg className="folder-back" viewBox="0 0 300 230" aria-hidden="true">
          <path d="M8 36 Q8 16 28 16 L94 16 Q106 16 113 24 L118 29 Q121 32 126 32 L272 32 Q292 32 292 52 L292 210 Q292 222 280 222 L20 222 Q8 222 8 210 Z" />
        </svg>

        <div className="folder-sheets" aria-hidden="true">
          {project.images.map((src, index) => (
            <span className={`folder-sheet folder-sheet-${index + 1}`} key={src}>
              <img src={src} alt="" loading="lazy" decoding="async" />
            </span>
          ))}
        </div>

        <svg className="folder-front" viewBox="0 0 300 230" aria-hidden="true">
          <path d="M6 138 Q6 118 26 118 L170 118 Q182 118 190 126 L194 130 Q199 135 207 135 L276 135 Q294 135 294 153 L294 210 Q294 226 278 226 L22 226 Q6 226 6 210 Z" />
        </svg>

        <div className="folder-label">
          <p className="folder-name">{project.name}</p>
          <p className="folder-summary">{project.summary}</p>
        </div>
        <span className="folder-arrow" aria-hidden="true">
          <ArrowIcon />
        </span>
      </div>
    </Tag>
  );
}
