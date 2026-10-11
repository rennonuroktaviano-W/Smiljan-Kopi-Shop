interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  as = "h2",
  className = "",
}: SectionHeadingProps) {
  const isLight = tone === "light";
  const alignCenter = align === "center";

  const Heading = as;

  return (
    <div
      className={`${alignCenter ? "mx-auto text-center" : "max-w-2xl"} ${className}`}
    >
      {eyebrow ? (
        <p
          className={`text-label font-semibold uppercase tracking-[0.3em] ${
            isLight ? "text-fog" : "text-olive-deep"
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <Heading
        className={`mt-4 font-display text-section ${
          isLight ? "text-ivory" : "text-obsidian"
        }`}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={`mt-5 text-body ${
            isLight ? "text-fog" : "text-graphite"
          } ${alignCenter ? "mx-auto max-w-xl" : ""}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}