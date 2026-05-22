import React from 'react';

export default function CatalogLoading() {
  return (
    <div className="flex-1 flex flex-col bg-surface p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 max-w-7xl mx-auto w-full">
        <div className="space-y-3 w-full md:w-1/2">
          <div className="h-4 w-32 bg-surface-container-high rounded animate-pulse"></div>
          <div className="h-10 w-3/4 bg-surface-container-high rounded animate-pulse"></div>
          <div className="h-4 w-2/3 bg-surface-container-high/60 rounded animate-pulse"></div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="h-12 w-full md:w-48 bg-surface-container-high rounded-xl animate-pulse"></div>
          <div className="h-12 w-12 bg-surface-container-high rounded-xl shrink-0 animate-pulse"></div>
        </div>
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex gap-2 overflow-x-hidden mb-8 max-w-7xl mx-auto w-full">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 w-28 bg-surface-container-low rounded-full animate-pulse border border-outline-variant/30"></div>
        ))}
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-5 flex flex-col gap-4 animate-pulse">
            <div className="h-40 w-full bg-surface-container-low rounded-2xl"></div>
            <div className="space-y-3 mt-2">
              <div className="flex justify-between items-start">
                <div className="h-4 w-16 bg-surface-container-high rounded-full"></div>
                <div className="h-4 w-12 bg-surface-container-high rounded-full"></div>
              </div>
              <div className="h-6 w-full bg-surface-container-high rounded"></div>
              <div className="h-4 w-3/4 bg-surface-container-high/70 rounded"></div>
            </div>
            <div className="mt-auto pt-4 flex justify-between items-center border-t border-outline-variant/30">
              <div className="h-6 w-24 bg-surface-container-high rounded"></div>
              <div className="h-8 w-20 bg-surface-container-high rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
