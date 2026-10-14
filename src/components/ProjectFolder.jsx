// A project shown as a folder: three screenshots tucked behind a solid front panel with
// the project's tech stack and an arrow. Each folder is its own link so it can be
// selected independently of the surrounding project row. On hover the screenshots lift
// slightly out of the folder. The SVG shapes share the stage's fixed aspect ratio, so their corners
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
    <a
      className="project-folder"
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${project.name} website`}
      data-cursor="View project"
    >
      <div className="folder-stage">
        <svg className="folder-back" viewBox="0 0 300 230" aria-hidden="true">
          <path d="M8 24 Q8 16 16 16 L96 16 Q104 16 109 22 L113 27 Q117 32 124 32 L284 32 Q292 32 292 40 L292 214 Q292 222 284 222 L16 222 Q8 222 8 214 Z" />
        </svg>

        <div className="folder-sheets" aria-hidden="true">
          {project.images.map((src, index) => (
            <span className={`folder-sheet folder-sheet-${index + 1}`} key={src}>
              <img src={src} alt="" loading="lazy" decoding="async" />
            </span>
          ))}
        </div>

        <svg className="folder-front" viewBox="0 0 300 230" aria-hidden="true">
          <path d="M6 126 Q6 118 14 118 L172 118 Q180 118 185 124 L189 129 Q193 135 201 135 L286 135 Q294 135 294 143 L294 218 Q294 226 286 226 L14 226 Q6 226 6 218 Z" />
        </svg>

        <ul className="folder-stack" aria-label={`Built with ${project.stack.join(", ")}`}>
          {project.stack.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
        <span className="folder-arrow" aria-hidden="true">
          <ArrowIcon />
        </span>
      </div>
    </a>
  );
}
