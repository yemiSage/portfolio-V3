import CaseStudyShell from "./CaseStudyShell";
import GithubStats from "./GithubStats";
import "../personal-pages.css";

export default function PersonalPageShell({ page, sections, children, onOpenAiChat }) {
  const pageLabel = page === "about" ? "About Yemi" : "Guestbook";
  return <>
    <a className="personal-skip" href="#personal-content">Skip to content</a>
    <CaseStudyShell sections={sections} projectName={pageLabel} pageLabel={pageLabel}
      className={`personal-page personal-page--${page}`} contentId="personal-content" railFooter={<GithubStats />}
      onOpenAiChat={onOpenAiChat}>{children}</CaseStudyShell>
  </>;
}
