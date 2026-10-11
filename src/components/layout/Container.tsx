export default function Container({
  children,
  className = "",
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <div className={`mx-auto w-full max-w-[var(--container-page)] px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}