'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase';

type WorkflowProcess = {
  id: string;
  community_id: string;
  initiated_by: string;
  process_type: string;
  related_id: string;
  current_state: string;
  context: any;
  last_updated: string;
};

interface TenderTrackerProps {
  initialWorkflows: WorkflowProcess[];
  communityId: string;
}

export function TenderTracker({ initialWorkflows, communityId }: TenderTrackerProps) {
  const [workflows, setWorkflows] = useState<WorkflowProcess[]>(initialWorkflows);

  useEffect(() => {
    // Subscribe to real-time changes on workflow_processes
    const channel = supabaseBrowser
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workflow_processes',
          filter: `community_id=eq.${communityId}`,
        },
        (payload) => {
          setWorkflows((current) => {
            if (payload.eventType === 'INSERT') {
              return [payload.new as WorkflowProcess, ...current];
            }
            if (payload.eventType === 'UPDATE') {
              return current.map((w) => (w.id === payload.new.id ? (payload.new as WorkflowProcess) : w));
            }
            if (payload.eventType === 'DELETE') {
              return current.filter((w) => w.id !== payload.old.id);
            }
            return current;
          });
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [communityId]);

  const stages = ['requested', 'in_progress', 'approved', 'rejected', 'completed'];

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {stages.map((stage) => {
          const items = workflows.filter((w) => w.current_state === stage);
          
          return (
            <div key={stage} className="w-72 bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-[500px]">
              <div className="p-3 border-b border-zinc-800/80 bg-zinc-900/80 sticky top-0">
                <h3 className="text-sm font-bold text-zinc-200 capitalize flex items-center justify-between">
                  {stage.replace('_', ' ')}
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{items.length}</span>
                </h3>
              </div>
              
              <div className="p-3 overflow-y-auto flex-1 space-y-3">
                {items.length === 0 ? (
                  <div className="text-center text-xs text-zinc-600 italic py-4">Kosong</div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50 shadow-sm hover:border-emerald-500/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase">{item.process_type.replace('_', ' ')}</span>
                        <span className="text-[10px] text-zinc-500" title={new Date(item.last_updated).toLocaleString()}>
                          {new Date(item.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 line-clamp-2">
                        {item.context?.title || item.context?.description || `Proses ID: ${item.id.split('-')[0]}`}
                      </p>
                      
                      {item.context?.amount && (
                        <div className="mt-2 text-xs font-semibold text-zinc-200">
                          Rp {(item.context.amount / 1000).toFixed(0)}K
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
