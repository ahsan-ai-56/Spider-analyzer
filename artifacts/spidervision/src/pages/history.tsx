import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetHistory,
  useGetHistoryStats,
  useDeleteScanHistory,
  useClearHistory,
  getGetHistoryQueryKey,
  getGetHistoryStatsQueryKey,
} from "@workspace/api-client-react";
import { Search, Trash2, AlertTriangle, Shield, Bug, Clock, BarChart3 } from "lucide-react";
import { useState } from "react";

type Filter = "all" | "dangerous" | "safe" | "today" | "this_week";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "dangerous", label: "Dangerous" },
  { key: "safe", label: "Safe" },
  { key: "today", label: "Today" },
  { key: "this_week", label: "This Week" },
];

export default function History() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [confirmClear, setConfirmClear] = useState(false);

  const { data: historyItems = [], isLoading } = useGetHistory(
    { search: search || undefined, filter: filter !== "all" ? filter : undefined },
    { query: { queryKey: getGetHistoryQueryKey({ search: search || undefined, filter: filter !== "all" ? filter : undefined }) } }
  );

  const { data: stats } = useGetHistoryStats({
    query: { queryKey: getGetHistoryStatsQueryKey() },
  });

  const deleteMutation = useDeleteScanHistory({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetHistoryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetHistoryStatsQueryKey() });
      },
    },
  });

  const clearMutation = useClearHistory({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetHistoryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetHistoryStatsQueryKey() });
        setConfirmClear(false);
      },
    },
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="py-10 px-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">Dashboard</span>
            <h1 className="text-3xl font-bold text-white mt-1">Scan History</h1>
          </div>
          {(historyItems.length > 0) && (
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-white/50 hover:text-red-400 hover:border-red-500/30 text-sm transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section className="py-6 px-4 border-b border-white/5">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Total Scans", value: stats.totalScans, icon: BarChart3 },
              { label: "Dangerous", value: stats.dangerousFound, icon: AlertTriangle },
              { label: "Safe", value: stats.safeFound, icon: Shield },
              { label: "Spider Scans", value: stats.spiderScans, icon: Bug },
              { label: "Bite Scans", value: stats.biteScans, icon: Clock },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="glass-card rounded-xl p-4 text-center">
                  <Icon className="w-4 h-4 text-white/30 mx-auto mb-1.5" />
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Search + Filters */}
      <section className="py-5 px-4">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="search"
              placeholder="Search by spider name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/[0.03] border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === f.key
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* History Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-xl h-40 animate-pulse" />
              ))}
            </div>
          ) : historyItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Bug className="w-7 h-7 text-white/20" />
              </div>
              <h3 className="text-white/60 font-semibold mb-2">No scans found</h3>
              <p className="text-white/30 text-sm mb-6">
                {search || filter !== "all" ? "Try different search terms or filters." : "Start by identifying a spider or analyzing a bite."}
              </p>
              <Link href="/spider-identifier">
                <button className="px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors">
                  Identify Your First Spider
                </button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {historyItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.04 }}
                    className="glass-card rounded-xl overflow-hidden group"
                  >
                    {item.imageBase64 ? (
                      <img
                        src={`data:image/jpeg;base64,${item.imageBase64}`}
                        alt={item.name}
                        className="w-full h-32 object-cover bg-black/60"
                      />
                    ) : (
                      <div className="w-full h-32 bg-white/[0.02] flex items-center justify-center">
                        <Bug className="w-8 h-8 text-white/10" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-white text-sm leading-tight">{item.name}</h3>
                          <span className="text-white/30 text-xs capitalize">{item.type} scan</span>
                        </div>
                        <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border ${
                          item.isDangerous
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-white/5 text-white/40 border-white/10"
                        }`}>
                          {item.isDangerous ? "Danger" : "Safe"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/25 text-xs">
                          {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <button
                          onClick={() => deleteMutation.mutate({ id: item.id })}
                          disabled={deleteMutation.isPending}
                          className="p-1 rounded text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Confirm clear dialog */}
      <AnimatePresence>
        {confirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              className="glass-card rounded-2xl p-6 max-w-sm w-full"
            >
              <h3 className="text-white font-bold text-lg mb-2">Clear All History?</h3>
              <p className="text-white/50 text-sm mb-6">This will permanently delete all scan history. This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => clearMutation.mutate()}
                  disabled={clearMutation.isPending}
                  className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {clearMutation.isPending ? "Clearing..." : "Clear All"}
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
