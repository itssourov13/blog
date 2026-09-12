export default function Loading() {
  return (
    <div className="container-content py-16 md:py-24">
      <div className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:items-start">
        <div className="mx-auto aspect-square w-48 animate-pulse rounded-full bg-muted sm:w-56 md:mx-0 md:w-full" />
        <div className="space-y-4">
          <div className="h-10 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
