interface SkeletonProps {
  variant: "horizontal" | "square" | "vertical";
}

export default function EventSkeleton({ variant }: SkeletonProps) {
  if (variant === "horizontal") {
    return (
      <div className="flex border border-gray-100 rounded-2xl overflow-hidden shrink-0 animate-pulse">
        <div className="w-80 h-80 bg-gray-200" />
        <div className="w-60 px-5 py-6 flex flex-col gap-3">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-full bg-gray-200 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 rounded mt-4" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="flex gap-2 mt-4">
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "square") {
    return (
      <div className="shrink-0 w-80 animate-pulse">
        <div className="w-80 h-80 bg-gray-200 rounded-2xl" />
        <div className="p-2 space-y-2 mt-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-full bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  // Default: Vertical (Grid style)
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-6 w-3/4 bg-gray-200 rounded" />
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
