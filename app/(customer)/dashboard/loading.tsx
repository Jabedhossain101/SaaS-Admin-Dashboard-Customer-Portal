export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-40 rounded-2xl bg-slate-900/60 border border-slate-800" />

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-slate-900/50 border border-slate-800" />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 rounded-2xl bg-slate-900/40 border border-slate-800" />
        <div className="h-72 rounded-2xl bg-slate-900/40 border border-slate-800" />
      </div>
    </div>
  );
}
