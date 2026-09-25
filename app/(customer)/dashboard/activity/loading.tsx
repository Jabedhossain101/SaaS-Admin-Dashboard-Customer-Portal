export default function ActivityLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-800 rounded-lg" />
        <div className="h-4 w-96 bg-slate-800/60 rounded-lg" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="h-10 max-w-md bg-slate-900 border border-slate-800 rounded-xl" />

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden divide-y divide-slate-800/60">
        <div className="h-14 bg-slate-900/80 p-4" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-slate-900/40 p-4" />
        ))}
      </div>
    </div>
  );
}
