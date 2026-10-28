import { useEffect, useState } from "react";

// Previews use local assets and stay inside the viewport, including wrapped lines.
export default function AboutProjectLink({ name, href, image, logo = false, children }) {
  const [preview, setPreview] = useState(null);
  const isOpen = preview !== null;
  useEffect(() => {
    if (!isOpen) return;
    const dismiss = () => setPreview(null);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [isOpen]);
  const showPreview = event => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPreview({
      left: Math.max(8, Math.min(rect.left + rect.width / 2 - 80, window.innerWidth - 168)),
      top: rect.top > 130 ? rect.top - 122 : rect.bottom + 8,
    });
  };
  return <a
    className={`about-inline-link about-project-link${logo ? " about-project-link--logo" : ""}`}
    href={href}
    {...(href.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    aria-label={logo ? name : undefined}
    onMouseEnter={showPreview} onMouseLeave={() => setPreview(null)}
    onFocus={showPreview} onBlur={() => setPreview(null)}
    onKeyDown={event => { if (event.key === "Escape") setPreview(null); }}
  >
    <span className="about-project-label">{children || (logo ? <img src={image} alt="" width="24" height="24" /> : name)}</span>
    {preview && <span className="about-project-preview" style={preview} aria-hidden="true">
      <img src={image} alt="" width="144" height="82" />
      <span>{name}</span>
    </span>}
  </a>;
}
