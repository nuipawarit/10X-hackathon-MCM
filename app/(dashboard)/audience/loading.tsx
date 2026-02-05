import { Skeleton } from '@/components/ui/skeleton';

export default function AudienceLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <Skeleton className="h-8 w-48 mx-auto rounded-full" />
        <Skeleton className="h-10 w-96 mx-auto" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    </div>
  );
}
