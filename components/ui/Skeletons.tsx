export function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton aspect-square" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-6 w-1/3 mt-1" />
        <div className="skeleton h-9 w-full rounded-xl" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonCategorias({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-2 overflow-x-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-9 rounded-full flex-shrink-0"
          style={{ width: `${60 + i * 15}px` }}
        />
      ))}
    </div>
  )
}
