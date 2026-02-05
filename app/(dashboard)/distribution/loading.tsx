import { Skeleton } from '@/components/ui/skeleton';

export default function DistributionLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <Skeleton className="h-8 w-48 mx-auto rounded-full" />
        <Skeleton className="h-10 w-96 mx-auto" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>
      <Skeleton className="h-96 w-full rounded-lg" />
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
