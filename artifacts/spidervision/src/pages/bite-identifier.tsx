import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useAnalyzeBite, getGetHistoryQueryKey, getGetHistoryStatsQueryKey } from "@workspace/api-client-react";
import ImageUploader from "@/components/image-uploader";
import { AlertTriangle, Thermometer, Eye, HeartPulse, Info } from "lucide-react";
import { useState } from "react";

const symptomInfo = [
  { icon: Eye, label: "Redness", desc: "Localized redness around bite site within 30-60 minutes." },
  { icon: Thermometer, label: "Swelling", desc: "Swelling and inflammation that may spread over hours." },
  { icon: HeartPulse, label: "Pain", desc: "Pain intensity varies by species — from mild to severe." },
  { icon: AlertTriangle, label: "Itching", desc: "Persistent itching is common with most spider bites." },
];

const safetySteps = [
  { step: "01", title: "Clean the Area", desc: "Wash the bite with soap and water for several minutes. Pat dry." },
  { step: "02", title: "Apply Cold Pack", desc: "Wrap ice in cloth and apply to the bite area to reduce swelling." },
  { step: "03", title: "Monitor Symptoms", desc: "Watch for spreading redness, increasing pain, or systemic symptoms." },
  { step: "04", title: "Seek Help If Needed", desc: "Go to emergency care if symptoms worsen or you feel unwell." },
];

export default function BiteIdentifier() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const analyzeMutation = useAnalyzeBite({
    mutation: {
      onSuccess: (data) => {
        localStorage.setItem("latestBiteResult", JSON.stringify(data));
        queryClient.invalidateQueries({ queryKey: getGetHistoryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetHistoryStatsQueryKey() });
        navigate("/results?type=bite");
      },
      onError: (err: unknown) => {
        setAnalyzeError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      },
    },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Medical warning banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-amber-800 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-500" />
          <span>This tool is informational only. Seek immediate medical attention for severe symptoms.</span>
        </div>
      </div>

      {/* Header */}
      <section className="py-10 px-4 border-b border-gray-100 bg-gradient-to-br from-amber-50/40 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold uppercase tracking-widest mb-3">Medical Analysis</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-3">Spider Bite Identifier AI</h1>
            <p className="text-gray-500 max-w-xl">
              Upload an image of a bite and AI will analyze possible causes, danger level, and recommended steps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upload */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6 border-l-4 border-l-amber-400">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-gray-900">Upload Bite Image</h2>
                <p className="text-gray-400 text-xs mt-0.5">Clear photos of the affected area work best</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                Bite Analysis
              </span>
            </div>
            <ImageUploader
              onAnalyze={(b64) => { setAnalyzeError(null); analyzeMutation.mutate({ data: { imageBase64: b64 } }); }}
              isLoading={analyzeMutation.isPending}
              error={analyzeError}
              analyzeLabel="Analyze Bite"
            />
          </motion.div>
        </div>
      </section>

      {/* Danger levels */}
      <section className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Danger Level Guide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { level: "Low", bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-700", desc: "Minor irritation. Clean, monitor, treat at home." },
              { level: "Medium", bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", desc: "Moderate symptoms. Monitor closely, see a doctor if worsening." },
              { level: "High", bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700", desc: "Serious symptoms possible. Seek immediate medical attention." },
            ].map((item) => (
              <motion.div key={item.level} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`rounded-xl p-5 ${item.bg} border ${item.border}`}>
                <div className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${item.badge} mb-3`}>
                  {item.level} Risk
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Symptoms */}
      <section className="py-12 px-4 border-t border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Common Bite Symptoms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {symptomInfo.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="glass-card rounded-xl p-5 text-center hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{s.label}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety Steps */}
      <section className="py-12 px-4 border-t border-gray-100 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">First Aid Steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {safetySteps.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass-card rounded-xl p-5 flex gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm leading-relaxed">
              AI predictions are estimates and may not always be fully accurate. Always consult a healthcare professional for medical decisions.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
