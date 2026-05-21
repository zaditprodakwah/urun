import { supabaseBrowser } from '../supabase';

export interface OfflineMutation {
  id: string;
  table: 'ledger' | 'profiles';
  action: 'insert' | 'update';
  data: Record<string, unknown>;
  timestamp: number; // For Last-Write-Wins CRDT resolution
}

const STORAGE_KEY = 'urun_offline_mutations';

// Fetch the current queue from LocalStorage safely
export function getOfflineQueue(): OfflineMutation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('❌ [Sync Engine] Gagal membaca LocalStorage:', err);
    return [];
  }
}

// Save the queue back to LocalStorage
function saveOfflineQueue(queue: OfflineMutation[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('❌ [Sync Engine] Gagal menulis ke LocalStorage:', err);
  }
}

// Add a new mutation to the offline queue
export function addOfflineMutation(table: 'ledger' | 'profiles', action: 'insert' | 'update', data: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  const mutation: OfflineMutation = {
    id: crypto.randomUUID(),
    table,
    action,
    data,
    timestamp: Date.now(),
  };

  const queue = getOfflineQueue();
  
  // CRDT LWW-Element-Set logic for updates: 
  // If we are updating the SAME profile, keep only the latest update mutation to minimize network payloads and overwrite conflicts
  if (action === 'update' && table === 'profiles') {
    const filtered = queue.filter(m => !(m.table === 'profiles' && m.action === 'update' && (m.data as Record<string, unknown>).id === (data as Record<string, unknown>).id));
    filtered.push(mutation);
    saveOfflineQueue(filtered);
    console.log(`📡 [Sync Engine] Ditambahkan ke antrean (CRDT LWW-Override):`, mutation);
  } else {
    queue.push(mutation);
    saveOfflineQueue(queue);
    console.log(`📡 [Sync Engine] Ditambahkan ke antrean offline:`, mutation);
  }
}

// Synchronize all pending mutations to Supabase safely (Relying on PostgreSQL RLS)
export async function syncOfflineMutations(onProgress?: (msg: string) => void): Promise<{ success: boolean; syncedCount: number; errors: string[] }> {
  if (typeof window === 'undefined') return { success: false, syncedCount: 0, errors: [] };
  
  if (!navigator.onLine) {
    return { success: false, syncedCount: 0, errors: ['Perangkat masih dalam keadaan offline.'] };
  }

  const queue = getOfflineQueue();
  if (queue.length === 0) {
    return { success: true, syncedCount: 0, errors: [] };
  }

  console.log(`🔄 [Sync Engine] Memulai proses sinkronisasi untuk ${queue.length} antrean...`);
  onProgress?.(`Sinkronisasi ${queue.length} transaksi tertunda...`);

  const errors: string[] = [];
  const successfulIds: string[] = [];

  for (const mutation of queue) {
    try {
      if (mutation.table === 'ledger') {
        if (mutation.action === 'insert') {
          // RLS will enforce that this user belongs to the community being written to
          const { error } = await supabaseBrowser
            .from('ledger')
            .insert(mutation.data);
          
          if (error) throw error;
        } else {
          // Ledger is IMMUTABLE! Sacred Rule #2
          throw new Error('Ledger is immutable. Updates/deletes are strictly forbidden.');
        }
      } else if (mutation.table === 'profiles') {
        if (mutation.action === 'update') {
          const { error } = await supabaseBrowser
            .from('profiles')
            .update(mutation.data)
            .eq('id', (mutation.data as Record<string, unknown>).id);

          if (error) throw error;
        } else if (mutation.action === 'insert') {
          const { error } = await supabaseBrowser
            .from('profiles')
            .insert(mutation.data);

          if (error) throw error;
        }
      }
      successfulIds.push(mutation.id);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Error tidak dikenal';
      console.error(`❌ [Sync Engine] Gagal memproses mutasi ID ${mutation.id}:`, err);
      errors.push(`Mutasi ${mutation.table} (${mutation.id}): ${errMsg}`);
    }
  }

  // Filter out successfully processed mutations
  const updatedQueue = getOfflineQueue().filter(m => !successfulIds.includes(m.id));
  saveOfflineQueue(updatedQueue);

  const syncedCount = successfulIds.length;
  console.log(`📊 [Sync Engine] Sinkronisasi Selesai: ${syncedCount} sukses, ${errors.length} gagal.`);
  
  return {
    success: errors.length === 0,
    syncedCount,
    errors,
  };
}

// Simple helper to register automatic listener when network recovers
export function initAutomaticSync(onSyncComplete?: (res: { success: boolean; syncedCount: number; errors: string[] }) => void) {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', async () => {
    console.log('🌐 [Sync Engine] Internet terdeteksi aktif kembali. Memicu sinkronisasi...');
    const result = await syncOfflineMutations();
    if (result.syncedCount > 0) {
      onSyncComplete?.(result);
    }
  });
}
