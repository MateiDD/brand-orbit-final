"use client";

import { motion } from "framer-motion";
import SpaceScene from "./components/SpaceScene";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-white selection:text-black">
      {/* 3D Background Layer */}
      <SpaceScene />

      {/* UI Overlay Layer */}
      <div className="relative z-10 flex min-h-screen flex-col pointer-events-none">
        
        {/* Navbar */}
        <header className="p-6 md:p-10 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase">
              Brand Orbit
            </h1>
          </motion.div>
        </header>

        {/* Hero Section */}
        <section className="flex flex-1 flex-col items-center justify-center px-4 text-center pointer-events-auto mt-[-10vh]">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter"
          >
            Launch Your Brand <br className="hidden md:block" /> Into Orbit.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="mt-6 max-w-2xl text-base md:text-xl text-neutral-400 font-light tracking-wide leading-relaxed"
          >
            We propel visionary businesses to astronomical growth through elite 
            social media management, data-driven marketing, and cutting-edge 
            digital strategy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="mt-10"
          >
            <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white px-8 py-4 font-medium text-black transition-transform hover:scale-105 active:scale-95">
              <span className="absolute inset-0 h-full w-full bg-neutral-200 opacity-0 transition-opacity group-hover:opacity-100"></span>
              <span className="relative z-10 font-bold uppercase tracking-wider text-sm">
                Start Your Journey
              </span>
            </button>
          </motion.div>
        </section>
        
        {/* Subtle bottom indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none text-neutral-500"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-neutral-500 to-transparent" />
        </motion.div>
      </div>
    </main>
  );
}