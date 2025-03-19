
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsLoadingSkeletonProps {
  showFeatured?: boolean;
}

const NewsLoadingSkeleton: React.FC<NewsLoadingSkeletonProps> = ({ 
  showFeatured = false 
}) => {
  return (
    <div className="space-y-8 animate-pulse">
      {showFeatured && (
        <div className="mb-10">
          <div className="bg-card rounded-xl border border-border overflow-hidden md:flex">
            <div className="aspect-video md:w-1/2">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="p-4 md:w-1/2 space-y-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={index} 
            className="bg-card rounded-xl border border-border overflow-hidden flex flex-col"
          >
            <div className="aspect-video">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="p-4 space-y-4 flex-grow">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsLoadingSkeleton;
