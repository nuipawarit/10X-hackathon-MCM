import { Skeleton } from '@/components/ui/skeleton';

export default function CreativeLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <Skeleton className="h-8 w-48 mx-auto rounded-full" />
        <Skeleton className="h-10 w-96 mx-auto" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-[#2A2A2E] rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
