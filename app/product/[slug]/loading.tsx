export default function ProductLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="grid gap-10 md:grid-cols-2 animate-pulse">
        <div className="aspect-square rounded-[2rem] bg-surface" />
        <div className="space-y-4">
          <div className="h-4 w-24 rounded bg-surface" />
          <div className="h-10 w-64 rounded bg-surface" />
          <div className="h-8 w-32 rounded bg-surface" />
          <div className="h-20 w-full rounded bg-surface" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 w-12 rounded-full bg-surface" />
            ))}
          </div>
          <div className="flex gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 w-16 rounded-xl bg-surface" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
