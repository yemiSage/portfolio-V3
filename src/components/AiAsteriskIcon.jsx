export default function AiAsteriskIcon({ size = 14, className = "", style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
        color: "#000000",
        ...style,
      }}
    >
      <path
        d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
        opacity="0.6"
        style={{ opacity: 0.6 }}
      />
    </svg>
  );
}
