// A project shown as a folder: three screenshots tucked behind a solid front panel with
// the project's tech stack and an arrow. When its row is hovered the screenshots fan out
// of the folder. The SVG shapes share the stage's fixed aspect ratio, so their corners
// never distort.

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="8 7 17 7 17 16" />
    </svg>
  );
}

export default function ProjectFolder({ project }) {
  return (
    <div className="project-folder" data-cursor="View project">
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

        <ul className="folder-stack" aria-label={`Built with ${project.stack.map((tool) => tool.name).join(", ")}`}>
          {project.stack.map((tool) => (
            <li key={tool.name} title={tool.name}>
              <img src={tool.icon} alt="" />
            </li>
          ))}
        </ul>
        <span className="folder-arrow" aria-hidden="true">
          <ArrowIcon />
        </span>
      </div>
    </div>
  );
}
