import { cn, seededRandom } from "@/lib/utils";
import type { Category } from "@/lib/types";

type Family = "circuit" | "network" | "field";

const FAMILY_BY_CATEGORY: Record<Category, Family> = {
  security: "circuit",
  "reverse-engineering": "circuit",
  engineering: "circuit",
  cloud: "circuit",
  web: "network",
  research: "network",
  programming: "network",
  development: "field",
  notes: "field",
};

const WIDTH = 400;
const HEIGHT = 300;

type Point = [number, number];

function generateCircuit(rand: () => number) {
  const cols = 6;
  const rows = 5;
  const cellW = WIDTH / cols;
  const cellH = HEIGHT / rows;
  const points: Point[] = Array.from({ length: 5 }, () => {
    const col = Math.floor(rand() * cols);
    const row = Math.floor(rand() * rows);
    return [col * cellW + cellW / 2, row * cellH + cellH / 2];
  });

  const paths: string[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    if (!from || !to) continue;
    paths.push(`M ${from[0]} ${from[1]} L ${from[0]} ${to[1]} L ${to[0]} ${to[1]}`);
  }

  return { paths, nodes: points };
}

function generateNetwork(rand: () => number) {
  const nodeCount = 9;
  const points: Point[] = Array.from({ length: nodeCount }, () => [
    24 + rand() * (WIDTH - 48),
    24 + rand() * (HEIGHT - 48),
  ]);

  const lines: [number, number, number, number][] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i];
      const b = points[j];
      if (!a || !b) continue;
      const dist = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (dist < 115) lines.push([a[0], a[1], b[0], b[1]]);
    }
  }

  return { lines, nodes: points };
}

function generateField(rand: () => number) {
  return Array.from({ length: 42 }, () => ({
    x: rand() * WIDTH,
    y: rand() * HEIGHT,
    size: rand() > 0.86 ? 3 : 1.5,
  }));
}

export function CoverArt({
  seed,
  category,
  src,
  className,
}: {
  seed: string;
  category: Category;
  /** When set (e.g. a post's `coverImage`), render the actual image instead
   *  of the generated artwork. `object-cover` mirrors the SVG's
   *  `preserveAspectRatio="xMidYMid slice"` so both fill their frame the
   *  same way. Browsers decode the source format (webp, png, …) natively. */
  src?: string | null;
  className?: string;
}) {
  if (src) {
    return <img src={src} alt="" className={cn(className, "object-cover")} />;
  }

  const rand = seededRandom(seed);
  const family = FAMILY_BY_CATEGORY[category];

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`Abstract illustration for a ${category.replace("-", " ")} article`}
    >
      <rect width={WIDTH} height={HEIGHT} fill="var(--color-muted)" />

      {Array.from({ length: 7 }).map((_, col) =>
        Array.from({ length: 5 }).map((_, row) => (
          <circle
            key={`grid-${col}-${row}`}
            cx={(col / 6) * WIDTH}
            cy={(row / 4) * HEIGHT}
            r={1}
            fill="var(--color-border)"
          />
        ))
      )}

      {family === "circuit" &&
        (() => {
          const { paths, nodes } = generateCircuit(rand);
          return (
            <>
              {paths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeOpacity={0.5}
                  strokeWidth={1.5}
                />
              ))}
              {nodes.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={3.5} fill="var(--color-accent)" />
              ))}
            </>
          );
        })()}

      {family === "network" &&
        (() => {
          const { lines, nodes } = generateNetwork(rand);
          return (
            <>
              {lines.map(([x1, y1, x2, y2], i) => (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--color-accent)"
                  strokeOpacity={0.32}
                  strokeWidth={1}
                />
              ))}
              {nodes.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={2.75} fill="var(--color-accent)" />
              ))}
            </>
          );
        })()}

      {family === "field" &&
        generateField(rand).map((m, i) => (
          <rect
            key={i}
            x={m.x}
            y={m.y}
            width={m.size}
            height={m.size}
            fill="var(--color-accent)"
            opacity={0.6}
          />
        ))}
    </svg>
  );
}
