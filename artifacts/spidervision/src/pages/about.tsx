import { motion } from "framer-motion";
import { GraduationCap, FlaskConical, Leaf, Heart, Upload, ScanLine, GitCompare, Brain, FileText } from "lucide-react";

const steps = [
  { icon: Upload, step: "01", title: "Upload Image", desc: "Provide a clear photo of the spider or bite via upload or live camera capture." },
  { icon: ScanLine, step: "02", title: "Scan Patterns", desc: "Vision AI analyzes body shape, leg arrangement, coloration, and markings." },
  { icon: GitCompare, step: "03", title: "Compare Features", desc: "Image features are compared against a trained model of spider species data." },
  { icon: Brain, step: "04", title: "Predict Species", desc: "The AI selects the most probable match with a confidence percentage." },
  { icon: FileText, step: "05", title: "Generate Results", desc: "Detailed results including species info, danger level, habitat, and safety advice." },
];

const audiences = [
  { icon: GraduationCap, title: "Students", desc: "Study arachnology and entomology with real-world AI identification tools." },
  { icon: FlaskConical, title: "Researchers", desc: "Quickly catalog and identify field specimens with AI-assisted analysis." },
  { icon: Leaf, title: "Gardeners", desc: "Safely identify spiders encountered during outdoor and gardening work." },
  { icon: Heart, title: "Nature Lovers", desc: "Explore and learn about the spider species sharing your environment." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <section className="py-12 px-4 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">About</span>
            <h1 className="text-4xl font-bold text-white mt-2 mb-4">SpiderVision AI</h1>
            <p className="text-white/50 text-lg leading-relaxed">
              An AI-powered platform for identifying spider species and analyzing bite images — built for curiosity, safety, and science.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is it */}
      <section className="py-12 px-4 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">What is SpiderVision AI?</h2>
            <p className="text-white/60 leading-relaxed mb-4">
              SpiderVision AI is a web-based tool that uses advanced computer vision to identify spider species from photographs. 
              By uploading an image of a spider — or pointing your camera at one — you receive instant analysis including the species name, 
              scientific classification, danger level, habitat information, and safety advice.
            </p>
            <p className="text-white/60 leading-relaxed">
              The platform also includes a bite analyzer that examines photographs of suspected spider bites to suggest possible spider types 
              and provide first-aid guidance. All analysis is powered by large multimodal AI models with vision capabilities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 px-4 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <div className="glass-card rounded-2xl p-6">
              <p className="text-white/70 leading-relaxed text-lg">
                "To make spider identification accessible to everyone — from curious children to field researchers — 
                reducing fear through knowledge and improving safety through accurate, instant information."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How AI Works */}
      <section className="py-12 px-4 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">How the AI Works</h2>
          <div className="space-y-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-5 items-start"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white/50" />
                  </div>
                  <div className="flex-1 pb-4 border-b border-white/5 last:border-b-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-white/20 uppercase tracking-widest">Step {step.step}</span>
                    </div>
                    <h3 className="font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who uses it */}
      <section className="py-12 px-4 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Why This Tool Matters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {audiences.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass-card rounded-xl p-5 flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-white/50" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">{a.title}</h3>
                    <p className="text-white/50 text-xs leading-relaxed">{a.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/10"
          >
            <h2 className="text-lg font-bold text-white mb-3">Disclaimer</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              AI predictions are estimates and may not always be fully accurate. SpiderVision AI should not be used as the sole basis 
              for medical or safety decisions. If you suspect a dangerous spider bite or are experiencing severe symptoms, 
              seek immediate professional medical attention. Always consult qualified experts — entomologists for species identification 
              and healthcare professionals for bite treatment.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
