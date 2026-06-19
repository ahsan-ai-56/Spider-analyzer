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
  { name: "Black Widow", sci: "Latrodectus mactans", dangerous: true },
  { name: "Jumping Spider", sci: "Phidippus regius", dangerous: false },
  { name: "Wolf Spider", sci: "Lycosidae sp.", dangerous: false },
  { name: "Tarantula", sci: "Brachypelma hamorii", dangerous: false },
  { name: "House Spider", sci: "Parasteatoda tepidariorum", dangerous: false },
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
        setAnalyzeError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      },
    },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-16 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50/40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl mx-auto text-center mb-12 relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-semibold uppercase tracking-widest mb-6">
              AI-Powered Identification
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-5 leading-tight">
              Identify Any Spider<br />
              <span className="green-gradient-text">Instantly with AI</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Upload a spider image or take a photo and identify species within seconds using our advanced AI vision analysis.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-2xl mx-auto glass-card rounded-2xl p-6 relative"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900">Spider Identifier</h2>
              <p className="text-gray-400 text-xs mt-0.5">Upload or capture a photo to analyze</p>
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

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-center mt-6">
          <Link href="/bite-identifier">
            <button className="px-5 py-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-green-600 hover:border-green-200 text-sm font-medium transition-colors shadow-sm">
              Analyze a Bite Instead →
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-14 px-4 border-t border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
              <div className="text-3xl font-bold green-gradient-text mb-1">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How It Works</h2>
            <p className="text-gray-500 text-sm">Three simple steps to spider identification</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Upload or Capture", desc: "Select an image from your device or use your camera to photograph a spider." },
              { step: "02", title: "AI Scans the Image", desc: "Our vision AI analyzes colors, patterns, body shape, and markings." },
              { step: "03", title: "Get Instant Results", desc: "Receive species name, danger level, habitat info, and safety advice." },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 shadow-sm">
                  {item.step}
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 border-t border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Platform Features</h2>
            <p className="text-gray-500 text-sm">Everything you need for spider identification</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="glass-card rounded-xl p-5 flex gap-4 items-start hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{f.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Spiders */}
      <section className="py-16 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Spider Species</h2>
            <p className="text-gray-500 text-sm">Commonly identified species in our database</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {spiders.map((sp, i) => (
              <motion.div key={sp.name} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -3 }} className="glass-card rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-50 border border-green-100">
                  <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                    <ellipse cx="20" cy="20" rx="7" ry="9" fill="#22c55e" fillOpacity="0.7" />
                    <ellipse cx="20" cy="12" rx="5" ry="5" fill="#10b981" fillOpacity="0.6" />
                    {[[-14,-6],[-10,-10],[-14,2],[-10,8],[14,-6],[10,-10],[14,2],[10,8]].map(([dx,dy],idx) => (
                      <line key={idx} x1="20" y1="20" x2={20+(dx as number)} y2={20+(dy as number)} stroke="#16a34a" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
                    ))}
                    {sp.dangerous && <circle cx="20" cy="25" r="2" fill="#ef4444" fillOpacity="0.9" />}
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{sp.name}</span>
                    {sp.dangerous && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">Venomous</span>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs italic">{sp.sci}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 border-t border-gray-100 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-sm">Common questions about SpiderVision AI</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="glass-card rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left text-gray-800 hover:text-green-700 transition-colors text-sm font-medium">
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 flex-shrink-0 text-gray-400 transition-transform ${openFaq === i ? "rotate-180 text-green-500" : ""}`} />
                </button>
                {openFaq === i && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10 px-4 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-white fill-white"><path d="M8 2a3 3 0 100 6A3 3 0 008 2zM5 8.5a3 3 0 00-3 3V13h12v-1.5a3 3 0 00-3-3H5z"/></svg>
            </div>
            <span className="text-gray-400 text-sm">SpiderVision AI — AI-Powered Spider Identification</span>
          </div>
          <div className="flex gap-6">
            {["Privacy", "Contact", "Terms"].map((item) => (
              <a key={item} href="#" className="text-gray-400 hover:text-green-600 text-sm transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
