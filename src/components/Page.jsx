export default function Page({ title, children, actions }) {
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {title && (
          <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-700">
            {title}
          </h1>
        )}
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}
