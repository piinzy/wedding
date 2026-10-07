export default function AdminLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6 animate-pulse lg:mr-60">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-sm" />
        ))}
      </div>
      <div className="h-64 bg-gray-100 rounded-sm" />
      <div className="h-48 bg-gray-100 rounded-sm" />
    </div>
  );
}
