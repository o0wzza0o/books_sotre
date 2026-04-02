import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`skeleton ${className}`} aria-hidden="true" />
);

export const BookCardSkeleton: React.FC = () => (
  <div className="rounded-xl overflow-hidden bg-white dark:bg-charcoal-700 shadow-sm">
    <Skeleton className="w-full h-56" />
    <div className="p-4 flex flex-col gap-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-1/3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  </div>
);
