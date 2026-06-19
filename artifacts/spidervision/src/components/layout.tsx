import { Link, useLocation } from "wouter";
import { Bug, Menu, X, Camera, Home, History, Info, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/spider-identifier", label: "Spider ID", icon: Camera },
    { href: "/bite-identifier", label: "Bite ID", icon: ShieldAlert },
    { href: "/history", label: "History", icon: History },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Green top accent bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />

      <nav className="fixed top-1 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15" style={{ height: "3.75rem" }}>
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-green-200">
                  <Bug className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold tracking-tight text-gray-900">SpiderVision</span>
                  <span className="text-lg font-bold tracking-tight green-gradient-text">AI</span>
                </div>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm shadow-green-200"
                        : "text-gray-500 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-30 bg-white pt-16 md:hidden"
          >
            <div className="px-4 pt-4 pb-3 space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-16 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
