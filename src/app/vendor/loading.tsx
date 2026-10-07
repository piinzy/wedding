export default function VendorLoading() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 animate-pulse">
      <div className="h-32 bg-gray-200 rounded-sm" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-sm" />
        ))}
      </div>
      <div className="h-64 bg-gray-100 rounded-sm" />
    </div>
  );
}
