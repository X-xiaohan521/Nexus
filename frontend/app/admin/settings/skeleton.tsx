import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonSettings() {
    return (
        <div className="w-full grid grid-cols-2 p-2 space-x-4">
            <div className="flex w-full max-w-xs flex-col gap-7">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <Skeleton className="h-8 w-24" />
            </div>
            <div className="flex w-full max-w-xs flex-col gap-7">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <Skeleton className="h-8 w-24" />
            </div>
        </div>
    )
}
