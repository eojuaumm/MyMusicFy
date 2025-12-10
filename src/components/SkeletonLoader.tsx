'use client'

export function MusicCardSkeleton() {
  return (
    <div className="animate-pulse bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="aspect-video w-full bg-gray-800" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
}

export function SearchResultSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 p-3 border-b border-gray-800">
      <div className="w-24 h-14 bg-gray-800 rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
      </div>
      <div className="w-10 h-10 bg-gray-800 rounded-full" />
    </div>
  );
}

export function MusicGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <MusicCardSkeleton key={i} />
      ))}
    </>
  );
}

