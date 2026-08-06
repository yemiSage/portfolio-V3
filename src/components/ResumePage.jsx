import { useEffect, useRef, useState } from "react";
import { ArrowLeft2 } from "iconsax-reactjs";

export const resumeViewUrl =
  "https://drive.google.com/file/d/1EQeSjevkPsXHZVUMtA8nd28qx604djE_/view?usp=sharing";

const resumeDownloadUrl =
  "/resume/opeyemi-adegboye-resume.pdf";

function ResumePages() {
  const canvasRefs = useRef([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    let loadingTask;

    const renderResume = async () => {
      try {
        const [{ getDocument, GlobalWorkerOptions }, workerModule] = await Promise.all([
          import("pdfjs-dist"),
          import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
        ]);
        GlobalWorkerOptions.workerSrc = workerModule.default;
        loadingTask = getDocument({ url: "/resume/opeyemi-adegboye-resume.pdf" });
        const pdf = await loadingTask.promise;
        if (!isCurrent) return;

        setPageCount(pdf.numPages);
        await new Promise((resolve) => requestAnimationFrame(resolve));

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.8 });
          const canvas = canvasRefs.current[pageNumber - 1];
          if (!canvas || !isCurrent) continue;

          const context = canvas.getContext("2d", { alpha: false });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvas, canvasContext: context, viewport }).promise;
        }
      } catch (error) {
        console.error("Unable to render resume", error);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    };

    renderResume();
    return () => {
      isCurrent = false;
      loadingTask?.destroy();
    };
  }, []);

  if (isLoading && pageCount === 0) {
    return <p className="resume-loading">Loading resume…</p>;
  }

  return (
    <div className="resume-pages" aria-label="Resume document">
      {Array.from({ length: pageCount }, (_, index) => (
        <canvas
          key={index}
          ref={(node) => { canvasRefs.current[index] = node; }}
          aria-label={`Resume page ${index + 1}`}
        />
      ))}
    </div>
  );
}

export function ResponsiveResumeLink({
  className = "",
  onDesktopClick,
  onMobileClick,
  isActive = false,
}) {
  const linkClassName = `${className}${isActive ? " is-active" : ""}`.trim();

  return (
    <>
      <a
        className={`resume-link-desktop ${linkClassName}`.trim()}
        href="/resume"
        onClick={onDesktopClick}
      >
        Resume
      </a>
      <a
        className={`resume-link-mobile ${linkClassName}`.trim()}
        href={resumeViewUrl}
        target="_blank"
        rel="noreferrer"
        onClick={onMobileClick}
      >
        Resume
      </a>
    </>
  );
}

export default function ResumeContent({ onBack }) {
  return (
    <section className="resume-viewer" aria-labelledby="resume-heading">
      <header className="resume-toolbar">
        <a className="resume-back" id="resume-heading" href="#about" onClick={onBack}>
          <ArrowLeft2 size={18} color="currentColor" variant="Linear" aria-hidden="true" />
          <span>Go Back</span>
        </a>
        <div className="resume-actions">
          <a
            href={resumeDownloadUrl}
            download="Opeyemi-Adegboye-Resume.pdf"
          >
            Download
          </a>
          <a href={resumeViewUrl} target="_blank" rel="noreferrer">Open in new tab</a>
        </div>
      </header>
      <div className="resume-frame-shell">
        <ResumePages />
      </div>
    </section>
  );
}
