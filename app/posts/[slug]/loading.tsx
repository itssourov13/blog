export default function Loading() {
  return (
    <div className="container-content py-14">
      <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-10 w-1/2 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-4 w-56 animate-pulse rounded bg-muted" />

      <div className="mt-10 aspect-[21/9] animate-pulse rounded-sm bg-muted" />

      <div className="mt-12 max-w-[68ch] space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}
