import { motion } from "framer-motion";
import { Link, useSearch } from "wouter";
import { AlertTriangle, Shield, Share2, Download, ExternalLink } from "lucide-react";

interface SpiderResult {
  id: number;
  spiderName: string;
  scientificName: string;
  confidence: number;
  isDangerous: boolean;
  dangerLevel: string | null;
  habitat: string;
  diet: string;
  lifespan: string;
  facts: string[];
  safetyInfo: string;
  relatedSpecies: string[];
  imageBase64?: string;
  analyzedAt: string;
}

interface BiteResult {
  id: number;
  possibleSpider: string;
  dangerLevel: string;
  symptoms: string[];
  safetyTips: string[];
  recommendation: string;
  imageBase64?: string;
  analyzedAt: string;
}

export default function Results() {
  const search = useSearch();
  const isBite = search.includes("type=bite");

  const spiderResult: SpiderResult | null = (() => {
    try { return JSON.parse(localStorage.getItem("latestSpiderResult") ?? "null"); } catch { return null; }
  })();

  const biteResult: BiteResult | null = (() => {
    try { return JSON.parse(localStorage.getItem("latestBiteResult") ?? "null"); } catch { return null; }
  })();

  const result = isBite ? biteResult : spiderResult;

  const handleShare = async () => {
    const text = isBite
      ? `Spider Bite Analysis: ${biteResult?.possibleSpider} (${biteResult?.dangerLevel} risk) — SpiderVision AI`
      : `Spider Identified: ${spiderResult?.spiderName} (${spiderResult?.confidence?.toFixed(0)}% confidence) — SpiderVision AI`;
    if (navigator.share) {
      await navigator.share({ title: "SpiderVision AI Result", text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
            <ExternalLink className="w-7 h-7 text-white/30" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Results Yet</h2>
          <p className="text-white/50 text-sm mb-6">Analyze a spider or bite image to see your results here.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/spider-identifier">
              <button className="px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors">
                Identify Spider
              </button>
            </Link>
            <Link href="/bite-identifier">
              <button className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white/70 hover:bg-white/10 text-sm transition-colors">
                Analyze Bite
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isBite && biteResult) {
    const danger = biteResult.dangerLevel;
    const dangerColor = danger === "high" ? "red" : danger === "medium" ? "amber" : "white";
    return (
      <div className="min-h-screen bg-black">
        <section className="py-10 px-4 border-b border-white/5">
          <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">Bite Analysis</span>
              <h1 className="text-3xl font-bold text-white mt-1">Analysis Result</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-white/70 hover:text-white text-sm transition-colors">
                <Share2 className="w-4 h-4" />Share
              </button>
            </div>
          </div>
        </section>

        <section className="py-10 px-4">
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main result */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
              {biteResult.imageBase64 && (
                <img src={`data:image/jpeg;base64,${biteResult.imageBase64}`} alt="Analyzed" className="w-full h-40 object-cover rounded-xl mb-4 bg-black/60" />
              )}
              <div className="mb-4">
                <span className="text-xs text-white/30 uppercase tracking-widest">Possible cause</span>
                <h2 className="text-2xl font-bold text-white mt-1">{biteResult.possibleSpider}</h2>
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                dangerColor === "red" ? "bg-red-500/15 text-red-400 border border-red-500/20" :
                dangerColor === "amber" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" :
                "bg-white/5 text-white/60 border border-white/10"
              }`}>
                {danger === "high" ? <AlertTriangle className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                {danger?.charAt(0).toUpperCase()}{danger?.slice(1)} Risk
              </div>
            </motion.div>

            {/* Symptoms */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Possible Symptoms</h3>
              <ul className="space-y-2">
                {biteResult.symptoms.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Safety tips */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Safety Tips</h3>
              <ul className="space-y-2">
                {biteResult.safetyTips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-white/70 text-sm">
                    <span className="text-white/30 mt-1">—</span>{tip}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Recommendation */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-3">Medical Recommendation</h3>
              <p className="text-white/70 text-sm leading-relaxed">{biteResult.recommendation}</p>
              <p className="text-white/30 text-xs mt-4 leading-relaxed">
                This tool is informational only. Consult a healthcare professional for medical decisions.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  // Spider result
  const sr = spiderResult!;
  return (
    <div className="min-h-screen bg-black">
      <section className="py-10 px-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">Spider Identification</span>
            <h1 className="text-3xl font-bold text-white mt-1">Analysis Result</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-white/70 hover:text-white text-sm transition-colors">
              <Share2 className="w-4 h-4" />Share
            </button>
            <button
              onClick={() => {
                const el = document.createElement("a");
                el.href = `data:text/plain,SpiderVision AI Result\n\nSpecies: ${sr.spiderName}\nScientific: ${sr.scientificName}\nConfidence: ${sr.confidence.toFixed(0)}%\nDangerous: ${sr.isDangerous ? "Yes" : "No"}\nHabitat: ${sr.habitat}\nDiet: ${sr.diet}\nLifespan: ${sr.lifespan}\n\nSafety Info: ${sr.safetyInfo}`;
                el.download = `spidervision-${sr.spiderName.replace(/\s+/g, "-").toLowerCase()}.txt`;
                el.click();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-white/70 hover:text-white text-sm transition-colors"
            >
              <Download className="w-4 h-4" />Download
            </button>
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Hero result card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row gap-6"
          >
            {sr.imageBase64 && (
              <img src={`data:image/jpeg;base64,${sr.imageBase64}`} alt="Uploaded spider" className="w-full sm:w-48 h-40 object-cover rounded-xl bg-black/60 flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <span className="text-xs text-white/30 uppercase tracking-widest">Identified Species</span>
                  <h2 className="text-2xl font-bold text-white mt-1">{sr.spiderName}</h2>
                  <p className="text-white/40 text-sm italic">{sr.scientificName}</p>
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                  sr.isDangerous
                    ? "bg-red-500/15 text-red-400 border border-red-500/20"
                    : "bg-white/5 text-white/60 border border-white/10"
                }`}>
                  {sr.isDangerous ? <AlertTriangle className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  {sr.isDangerous ? "Dangerous" : "Harmless"}
                </div>
              </div>

              {/* Confidence bar */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-white/40">AI Confidence</span>
                  <span className="text-sm font-bold text-white">{sr.confidence.toFixed(0)}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sr.confidence}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="h-full rounded-full bg-white"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Habitat", value: sr.habitat },
              { label: "Diet", value: sr.diet },
              { label: "Lifespan", value: sr.lifespan },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="glass-card rounded-xl p-4"
              >
                <span className="text-xs text-white/30 uppercase tracking-widest">{item.label}</span>
                <p className="text-white/80 text-sm mt-1 leading-relaxed">{item.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Facts + Safety */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Interesting Facts</h3>
              <ul className="space-y-3">
                {sr.facts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                    <span className="text-xs font-bold text-white/20 mt-0.5 w-5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Safety Information</h3>
              <p className="text-white/70 text-sm leading-relaxed">{sr.safetyInfo}</p>
              {sr.relatedSpecies.length > 0 && (
                <div className="mt-5">
                  <span className="text-xs text-white/30 uppercase tracking-widest">Related Species</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sr.relatedSpecies.map((sp) => (
                      <span key={sp} className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60 text-xs">{sp}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 flex-wrap"
          >
            <Link href="/spider-identifier">
              <button className="px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-sm hover:bg-white/90 transition-colors">
                Analyze Another Spider
              </button>
            </Link>
            <Link href="/history">
              <button className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/15 text-white/70 hover:text-white text-sm transition-colors">
                View History
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
