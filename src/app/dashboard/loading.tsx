import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-col bg-zinc-950 p-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-8 w-64 bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-zinc-800/60 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-zinc-800 rounded-xl animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="h-8 w-8 bg-zinc-800 rounded-lg"></div>
              <div className="h-5 w-16 bg-zinc-800 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-zinc-800/70 rounded"></div>
              <div className="h-6 w-32 bg-zinc-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 min-h-[400px] animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 w-48 bg-zinc-800 rounded"></div>
            <div className="h-8 w-24 bg-zinc-800 rounded-xl"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 w-full bg-zinc-800/40 rounded-xl"></div>
            ))}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 min-h-[400px] animate-pulse">
          <div className="h-6 w-32 bg-zinc-800 rounded mb-6"></div>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-10 w-10 bg-zinc-800 rounded-full shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-full bg-zinc-800 rounded"></div>
                  <div className="h-3 w-2/3 bg-zinc-800/60 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
