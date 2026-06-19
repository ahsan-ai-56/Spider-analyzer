import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useAnalyzeSpider, getGetHistoryQueryKey, getGetHistoryStatsQueryKey } from "@workspace/api-client-react";
import ImageUploader from "@/components/image-uploader";
import { AlertTriangle, Info, Shield } from "lucide-react";
import { useState } from "react";

const spiderCards = [
  { name: "Black Widow", sci: "Latrodectus mactans", desc: "Venomous spider known for distinctive red hourglass markings on abdomen.", dangerous: true },
  { name: "Jumping Spider", sci: "Phidippus regius", desc: "Small, agile spider with excellent binocular vision. Curious and harmless.", dangerous: false },
  { name: "Wolf Spider", sci: "Lycosidae sp.", desc: "Fast-moving ground hunter. Large eyes, hairy body. Rarely bites humans.", dangerous: false },
  { name: "Tarantula", sci: "Brachypelma hamorii", desc: "Large, slow-moving spider. Despite intimidating size, venom is mild.", dangerous: false },
  { name: "House Spider", sci: "Parasteatoda tepidariorum", desc: "Common indoor spider that builds messy cobwebs. Completely harmless.", dangerous: false },
];

const facts = [
  "Spiders have 6-8 eyes arranged in species-specific patterns used for identification.",
  "Most spiders produce silk from multiple glands, each for different purposes.",
  "Only about 0.1% of spider species are dangerous to humans.",
  "Spiders play a vital role in ecosystem balance by controlling insect populations.",
  "Some species can survive for months without food or water.",
  "Spiders can feel vibrations in their webs from several meters away.",
];

export default function SpiderIdentifier() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const analyzeMutation = useAnalyzeSpider({
    mutation: {
      onSuccess: (data) => {
        localStorage.setItem("latestSpiderResult", JSON.stringify(data));
        queryClient.invalidateQueries({ queryKey: getGetHistoryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetHistoryStatsQueryKey() });
        navigate("/results");
      },
      onError: (err: unknown) => {
        setAnalyzeError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      },
    },
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="py-12 px-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">AI Tool</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">Spider Identifier AI</h1>
            <p className="text-white/50 max-w-xl">
              Upload a spider image or take a photo to identify spider species instantly using AI vision analysis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upload section */}
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <ImageUploader
              onAnalyze={(b64) => {
                setAnalyzeError(null);
                analyzeMutation.mutate({ data: { imageBase64: b64 } });
              }}
              isLoading={analyzeMutation.isPending}
              error={analyzeError}
              analyzeLabel="Identify Spider"
            />
          </motion.div>
        </div>
      </section>

      {/* Spider info cards */}
      <section className="py-10 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Common Spider Species</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {spiderCards.map((sp, i) => (
              <motion.div
                key={sp.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-card rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{sp.name}</h3>
                    <p className="text-white/30 text-xs italic">{sp.sci}</p>
                  </div>
                  {sp.dangerous ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Venomous
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Harmless
                    </span>
                  )}
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{sp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Spider Facts */}
      <section className="py-10 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-5 h-5 text-white/40" />
            <h2 className="text-xl font-bold text-white">Spider Facts</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {facts.map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <span className="text-xs font-bold text-white/20 mt-0.5 w-5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-white/60 text-sm leading-relaxed">{fact}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="py-10 px-4 border-t border-white/5 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-white/60" />
              <h2 className="text-lg font-bold text-white">Spider Safety Guidelines</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-white/60">
              <ul className="space-y-2">
                {["Never handle a spider with bare hands", "Shake out shoes and clothing left outdoors", "Check under rocks and logs before reaching", "Keep a safe distance when photographing"].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="text-white/30 mt-1">—</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {["If bitten, remain calm and seek medical help", "Try to capture or photograph the spider for ID", "Apply ice to reduce swelling if bitten", "Do not try to suck out venom — this is a myth"].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="text-white/30 mt-1">—</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
