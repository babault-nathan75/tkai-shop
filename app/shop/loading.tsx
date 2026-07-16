export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-background px-4 py-14">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-4 w-16 rounded bg-surface" />
        <div className="mt-4 h-12 w-80 rounded bg-surface" />
        <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-3xl bg-surface" />
          ))}
        </div>
      </div>
    </main>
  );
}
