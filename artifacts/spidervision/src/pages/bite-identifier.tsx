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
    <div className="min-h-screen bg-black">
      {/* Medical warning banner */}
      <div className="bg-amber-900/20 border-b border-amber-500/20 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-amber-200/80 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>This tool is informational only and not a replacement for professional medical advice. Seek immediate medical attention for severe symptoms.</span>
        </div>
      </div>

      {/* Header */}
      <section className="py-10 px-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-amber-400/60 uppercase tracking-widest bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">Medical Analysis</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">Spider Bite Identifier AI</h1>
            <p className="text-white/50 max-w-xl">
              Upload an image of a bite and AI will analyze possible causes, danger level, and recommended steps.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upload */}
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 border border-amber-500/10"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">Bite Analysis</span>
            </div>
            <ImageUploader
              onAnalyze={(b64) => {
                setAnalyzeError(null);
                analyzeMutation.mutate({ data: { imageBase64: b64 } });
              }}
              isLoading={analyzeMutation.isPending}
              error={analyzeError}
              analyzeLabel="Analyze Bite"
            />
          </motion.div>
        </div>
      </section>

      {/* Result preview card (danger levels explained) */}
      <section className="py-10 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Danger Level Guide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { level: "Low", color: "white", bg: "bg-white/5", border: "border-white/10", desc: "Minor irritation. Clean, monitor, treat at home." },
              { level: "Medium", color: "amber", bg: "bg-amber-500/5", border: "border-amber-500/20", desc: "Moderate symptoms. Monitor closely, see a doctor if worsening." },
              { level: "High", color: "red", bg: "bg-red-500/5", border: "border-red-500/20", desc: "Serious symptoms possible. Seek immediate medical attention." },
            ].map((item) => (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-xl p-5 ${item.bg} border ${item.border}`}
              >
                <div className={`text-sm font-bold mb-2 ${item.color === "red" ? "text-red-400" : item.color === "amber" ? "text-amber-400" : "text-white/70"}`}>
                  {item.level} Risk
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Symptoms */}
      <section className="py-10 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Common Bite Symptoms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {symptomInfo.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="glass-card rounded-xl p-5 text-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-white/50" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">{s.label}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety Steps */}
      <section className="py-10 px-4 border-t border-white/5 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">First Aid Steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {safetySteps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-5 flex gap-4"
              >
                <span className="text-3xl font-black text-white/10 leading-none">{s.step}</span>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">{s.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 p-4 rounded-xl bg-amber-900/10 border border-amber-500/15 flex items-start gap-3"
          >
            <Info className="w-4 h-4 text-amber-400/70 flex-shrink-0 mt-0.5" />
            <p className="text-amber-200/50 text-sm leading-relaxed">
              AI predictions are estimates and may not always be fully accurate. Always consult a healthcare professional for medical decisions.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
