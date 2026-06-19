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
    <div className="min-h-screen bg-white">
      {/* Green header */}
      <section className="hero-green pt-12 pb-16 px-4 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white/90 text-xs font-semibold uppercase tracking-widest mb-4">AI Tool</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">Spider Identifier AI</h1>
            <p className="text-green-100/80 max-w-xl">
              Upload a spider image or take a photo to identify spider species instantly using AI vision analysis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upload card overlapping hero */}
      <section className="px-4 -mt-6 pb-10">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6 shadow-xl shadow-green-900/10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-gray-900">Upload Spider Image</h2>
                <p className="text-gray-400 text-xs mt-0.5">Clear, well-lit photos give the best results</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                AI Ready
              </span>
            </div>
            <ImageUploader
              onAnalyze={(b64) => { setAnalyzeError(null); analyzeMutation.mutate({ data: { imageBase64: b64 } }); }}
              isLoading={analyzeMutation.isPending}
              error={analyzeError}
              analyzeLabel="Identify Spider"
            />
          </motion.div>
        </div>
      </section>

      {/* Spider species grid */}
      <section className="py-12 px-4 section-green border-t border-green-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Common Spider Species</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {spiderCards.map((sp, i) => (
              <motion.div key={sp.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="glass-card rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{sp.name}</h3>
                    <p className="text-gray-400 text-xs italic">{sp.sci}</p>
                  </div>
                  {sp.dangerous ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center gap-1 flex-shrink-0">
                      <AlertTriangle className="w-3 h-3" />Venomous
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 flex items-center gap-1 flex-shrink-0">
                      <Shield className="w-3 h-3" />Harmless
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{sp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facts on green bg */}
      <section className="py-12 px-4 hero-green">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center border border-white/20">
              <Info className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Spider Facts</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {facts.map((fact, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="glass-card-dark rounded-xl flex items-start gap-3 p-4">
                <span className="text-xs font-bold text-green-300 mt-0.5 w-5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-white/80 text-sm leading-relaxed">{fact}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety on white */}
      <section className="py-12 px-4 border-t border-gray-100 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center shadow-sm">
                <Shield className="w-4.5 h-4.5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Spider Safety Guidelines</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <ul className="space-y-2.5">
                {["Never handle a spider with bare hands", "Shake out shoes and clothing left outdoors", "Check under rocks and logs before reaching", "Keep a safe distance when photographing"].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2.5">
                {["If bitten, remain calm and seek medical help", "Try to capture or photograph the spider for ID", "Apply ice to reduce swelling if bitten", "Do not try to suck out venom — this is a myth"].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">✓</span>
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
