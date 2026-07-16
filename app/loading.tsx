export default function Loading() {
  return (
    <main className="min-h-screen bg-background px-4 py-14">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-4 w-24 rounded bg-surface" />
        <div className="mt-4 h-12 w-64 rounded bg-surface" />
        <div className="mt-6 h-6 w-96 rounded bg-surface" />
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-3xl bg-surface" />
          ))}
        </div>
      </div>
    </main>
  );
}
