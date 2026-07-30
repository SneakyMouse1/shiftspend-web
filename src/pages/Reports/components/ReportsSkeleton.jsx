export default function ReportsSkeleton() {
  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-secondary/50 rounded-xl" />
          <div className="h-4 w-72 bg-secondary/30 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-secondary/50 rounded-xl" />
          <div className="h-10 w-28 bg-secondary/50 rounded-xl" />
          <div className="h-10 w-28 bg-secondary/50 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-3xl border border-border/40 bg-card/40 p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-secondary/50 rounded" />
              <div className="h-8 w-8 bg-secondary/50 rounded-xl" />
            </div>
            <div className="h-7 w-32 bg-secondary/50 rounded" />
            <div className="h-2 w-full bg-secondary/30 rounded-full" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 rounded-3xl border border-border/40 bg-card/40 p-6 space-y-4">
          <div className="h-6 w-48 bg-secondary/50 rounded" />
          <div className="h-72 w-full bg-secondary/30 rounded-2xl" />
        </div>
        <div className="h-96 rounded-3xl border border-border/40 bg-card/40 p-6 space-y-4">
          <div className="h-6 w-40 bg-secondary/50 rounded" />
          <div className="h-48 w-48 mx-auto bg-secondary/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
