export default function DashboardLoading() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-36 bg-gray-200 rounded-sm" />
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-sm" />
        ))}
      </div>
      {/* Content skeleton */}
      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 h-64 bg-gray-100 rounded-sm" />
        <div className="lg:col-span-2 h-64 bg-gray-100 rounded-sm" />
      </div>
    </div>
  );
}
