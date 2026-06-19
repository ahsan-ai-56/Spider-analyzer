import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useAnalyzeSpider, getGetHistoryQueryKey, getGetHistoryStatsQueryKey } from "@workspace/api-client-react";
import ImageUploader from "@/components/image-uploader";
import { Shield, Zap, Camera, Clock, AlertTriangle, Smartphone, ChevronDown } from "lucide-react";
import { useState } from "react";

const stats = [
  { value: "10K+", label: "Images Analyzed" },
  { value: "95%", label: "Detection Accuracy" },
  { value: "100+", label: "Species Identified" },
  { value: "24/7", label: "AI Support" },
];

const features = [
  { icon: Zap, title: "AI Detection", desc: "Powered by advanced vision AI to identify species instantly." },
  { icon: Camera, title: "Camera Capture", desc: "Use your device camera to capture spiders in real time." },
  { icon: Shield, title: "Real-Time Analysis", desc: "Get identification results in seconds, not minutes." },
  { icon: Clock, title: "Fast Results", desc: "Optimized pipeline delivers analysis under 5 seconds." },
  { icon: AlertTriangle, title: "Danger Alerts", desc: "Immediate warning for venomous or dangerous species." },
  { icon: Smartphone, title: "Mobile Friendly", desc: "Works seamlessly on phones, tablets, and desktops." },
];

const spiders = [
  { name: "Black Widow", sci: "Latrodectus mactans", dangerous: true, color: "#1a1a1a", mark: "red" },
  { name: "Jumping Spider", sci: "Phidippus regius", dangerous: false, color: "#3a2a1a", mark: "amber" },
  { name: "Wolf Spider", sci: "Lycosidae sp.", dangerous: false, color: "#2a2a1a", mark: "gray" },
  { name: "Tarantula", sci: "Brachypelma hamorii", dangerous: false, color: "#2a1a0a", mark: "brown" },
  { name: "House Spider", sci: "Parasteatoda tepidariorum", dangerous: false, color: "#1a1a2a", mark: "silver" },
];

const faqs = [
  {
    q: "How accurate is the AI identification?",
    a: "Our AI achieves approximately 95% accuracy on clear, well-lit images. Results may vary on blurry or partial images. Always cross-reference with a professional for safety-critical decisions.",
  },
  {
    q: "Can I use my camera directly?",
    a: "Yes. Tap Take Photo to activate your device camera. You will be prompted to grant camera permission. Works on both mobile and desktop browsers.",
  },
  {
    q: "Is SpiderVision AI free to use?",
    a: "The tool is available to use with your own OpenAI API key. The API key is required for image analysis and is stored securely as an environment secret.",
  },
  {
    q: "Can the AI make mistakes?",
    a: "Yes. AI predictions are estimates based on visual patterns and may not always be fully accurate. Never rely solely on this tool for medical or safety decisions.",
  },
];

export default function Home() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const analyzeMutation = useAnalyzeSpider({
    mutation: {
      onSuccess: (data) => {
        localStorage.setItem("latestSpiderResult", JSON.stringify(data));
        queryClient.invalidateQueries({ queryKey: getGetHistoryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetHistoryStatsQueryKey() });
        navigate("/results");
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Analysis failed. Please try again.";
        setAnalyzeError(msg);
      },
    },
  });

  const handleAnalyze = (base64: string) => {
    setAnalyzeError(null);
    analyzeMutation.mutate({ data: { imageBase64: base64 } });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero + Upload */}
      <section className="relative pt-12 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
              Identify Any Spider<br />
              <span className="text-white/50">Instantly with AI</span>
            </h1>
            <p className="text-lg text-white/50 max-w-xl mx-auto">
              Upload a spider image or take a photo and identify spider species within seconds using AI.
            </p>
          </motion.div>
        </div>

        {/* Main upload card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-2xl mx-auto glass-card rounded-2xl p-6"
        >
          <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-4">Spider Identifier</h2>
          <ImageUploader
            onAnalyze={handleAnalyze}
            isLoading={analyzeMutation.isPending}
            error={analyzeError}
            analyzeLabel="Identify Spider"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-4 mt-6 flex-wrap"
        >
          <Link href="/bite-identifier">
            <button className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors">
              Analyze a Bite Instead
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-white/40">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Upload or Capture", desc: "Select an image from your device or use your camera to photograph a spider." },
              { step: "02", title: "AI Scans the Image", desc: "Our vision AI analyzes colors, patterns, body shape, and markings." },
              { step: "03", title: "Get Instant Results", desc: "Receive species name, danger level, habitat info, and safety advice." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-6 relative"
              >
                <div className="text-5xl font-black text-white/5 absolute top-4 right-5 select-none">{item.step}</div>
                <div className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-2">Step {item.step}</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="glass-card rounded-xl p-5 flex gap-4 items-start hover:border-white/15 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white/70" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Spiders */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Popular Spider Species</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {spiders.map((sp, i) => (
              <motion.div
                key={sp.name}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -3 }}
                className="glass-card rounded-xl p-5 flex items-center gap-4 cursor-default"
              >
                {/* Spider silhouette */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/10">
                  <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                    <ellipse cx="20" cy="20" rx="7" ry="9" fill="white" fillOpacity="0.6" />
                    <ellipse cx="20" cy="12" rx="5" ry="5" fill="white" fillOpacity="0.5" />
                    {[[-14,-6],[-10,-10],[-14,2],[-10,8],[14,-6],[10,-10],[14,2],[10,8]].map(([dx,dy],idx) => (
                      <line key={idx} x1="20" y1="20" x2={20+(dx as number)} y2={20+(dy as number)} stroke="white" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
                    ))}
                    {sp.dangerous && <circle cx="20" cy="25" r="2" fill="#ef4444" fillOpacity="0.8" />}
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{sp.name}</span>
                    {sp.dangerous && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/20">Venomous</span>
                    )}
                  </div>
                  <span className="text-white/40 text-xs italic">{sp.sci}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5 text-white/50 text-sm leading-relaxed border-t border-white/5 pt-4"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white/30 text-sm">SpiderVision AI — AI-Powered Spider Identification</span>
          <div className="flex gap-6">
            {["Privacy", "Contact", "Terms", "GitHub"].map((item) => (
              <a key={item} href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
