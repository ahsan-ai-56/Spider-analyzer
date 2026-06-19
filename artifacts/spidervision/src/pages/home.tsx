import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useAnalyzeSpider, getGetHistoryQueryKey, getGetHistoryStatsQueryKey } from "@workspace/api-client-react";
import ImageUploader from "@/components/image-uploader";
import { Shield, Zap, Camera, Clock, AlertTriangle, Smartphone, ChevronDown, ArrowRight } from "lucide-react";
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
  { q: "How accurate is the AI identification?", a: "Our AI achieves approximately 95% accuracy on clear, well-lit images. Results may vary on blurry or partial images. Always cross-reference with a professional for safety-critical decisions." },
  { q: "Can I use my camera directly?", a: "Yes. Tap Take Photo to activate your device camera. You will be prompted to grant camera permission. Works on both mobile and desktop browsers." },
  { q: "Is SpiderVision AI free to use?", a: "The tool is available to use with your own OpenAI API key. The API key is required for image analysis and is stored securely as an environment secret." },
  { q: "Can the AI make mistakes?", a: "Yes. AI predictions are estimates based on visual patterns and may not always be fully accurate. Never rely solely on this tool for medical or safety decisions." },
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
      {/* ── Hero — deep green gradient ── */}
      <section className="relative overflow-hidden hero-green pt-16 pb-24 px-4">
        {/* decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center mb-12 relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white/90 text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
              AI-Powered Identification
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-5 leading-tight">
              Identify Any Spider<br />
              <span className="text-green-200">Instantly with AI</span>
            </h1>
            <p className="text-lg text-green-100/80 max-w-xl mx-auto">
              Upload a spider image or take a photo and identify species within seconds using advanced AI vision analysis.
            </p>
          </motion.div>
        </div>

        {/* Upload card — white on green */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-2xl shadow-green-900/30 relative"
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

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-center mt-6">
          <Link href="/bite-identifier">
            <button className="flex items-center gap-2 px-5 py-2 rounded-full btn-green-outline text-sm font-medium">
              Analyze a Bite Instead <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </motion.div>
      </section>

      {/* ── Stats — green gradient ── */}
      <section className="py-14 px-4 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
              <div className="text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-sm text-green-100/70">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works — light green bg ── */}
      <section className="py-16 px-4 section-green border-t border-green-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold uppercase tracking-widest mb-3">Simple Process</span>
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Upload or Capture", desc: "Select an image from your device or use your camera to photograph a spider." },
              { step: "02", title: "AI Scans the Image", desc: "Our vision AI analyzes colors, patterns, body shape, and markings." },
              { step: "03", title: "Get Instant Results", desc: "Receive species name, danger level, habitat info, and safety advice." },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-0.5">
                <div className="w-12 h-12 rounded-full btn-green flex items-center justify-center mx-auto mb-4 text-white font-bold text-sm">
                  {item.step}
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features — white bg ── */}
      <section className="py-16 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold uppercase tracking-widest mb-3">Features</span>
            <h2 className="text-2xl font-bold text-gray-900">Platform Features</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="glass-card rounded-xl p-5 flex gap-4 items-start hover:shadow-md hover:border-green-100 transition-all group">
                  <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 group-hover:border-green-500 transition-colors">
                    <Icon className="w-4 h-4 text-green-600 group-hover:text-white transition-colors" />
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

      {/* ── Spiders — green bg ── */}
      <section className="py-16 px-4 hero-green">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-white/90 text-xs font-semibold uppercase tracking-widest mb-3">Species Database</span>
            <h2 className="text-2xl font-bold text-white">Popular Spider Species</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {spiders.map((sp, i) => (
              <motion.div key={sp.name} initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -3 }} className="glass-card-dark rounded-xl p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/15">
                  <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                    <ellipse cx="20" cy="20" rx="7" ry="9" fill="white" fillOpacity="0.7" />
                    <ellipse cx="20" cy="12" rx="5" ry="5" fill="white" fillOpacity="0.5" />
                    {[[-14,-6],[-10,-10],[-14,2],[-10,8],[14,-6],[10,-10],[14,2],[10,8]].map(([dx,dy],idx) => (
                      <line key={idx} x1="20" y1="20" x2={20+(dx as number)} y2={20+(dy as number)} stroke="white" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
                    ))}
                    {sp.dangerous && <circle cx="20" cy="24" r="2.5" fill="#f87171" />}
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white text-sm">{sp.name}</span>
                    {sp.dangerous && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-400/30">Venomous</span>
                    )}
                  </div>
                  <span className="text-green-200/60 text-xs italic">{sp.sci}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ — light green bg ── */}
      <section className="py-16 px-4 section-green border-t border-green-100">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold uppercase tracking-widest mb-3">FAQ</span>
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="glass-card rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left text-gray-800 hover:text-green-700 transition-colors text-sm font-medium">
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 flex-shrink-0 text-green-500 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner — green ── */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Identify Spiders?</h2>
          <p className="text-green-100/80 mb-7 text-sm">Upload your first image and get results in seconds.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/spider-identifier">
              <button className="px-6 py-3 rounded-xl bg-white text-green-700 font-bold text-sm hover:bg-green-50 transition-colors shadow-lg">
                Identify a Spider
              </button>
            </Link>
            <Link href="/bite-identifier">
              <button className="px-6 py-3 rounded-xl btn-green-outline font-semibold text-sm">
                Analyze a Bite
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8 px-4 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-white"><ellipse cx="8" cy="9" rx="3" ry="4" /><ellipse cx="8" cy="5" rx="2.5" ry="2.5" /><line x1="8" y1="9" x2="2" y2="6" stroke="white" strokeWidth="1"/><line x1="8" y1="9" x2="1" y2="9" stroke="white" strokeWidth="1"/><line x1="8" y1="9" x2="2" y2="12" stroke="white" strokeWidth="1"/><line x1="8" y1="9" x2="14" y2="6" stroke="white" strokeWidth="1"/><line x1="8" y1="9" x2="15" y2="9" stroke="white" strokeWidth="1"/><line x1="8" y1="9" x2="14" y2="12" stroke="white" strokeWidth="1"/></svg>
            </div>
            <span className="text-gray-400 text-sm">SpiderVision AI — AI-Powered Spider Identification</span>
          </div>
          <div className="flex gap-5">
            {["Privacy", "Contact", "Terms"].map((item) => (
              <a key={item} href="#" className="text-gray-400 hover:text-green-600 text-sm transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
