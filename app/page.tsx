"use client";

import { useRef, useState, FormEvent, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useProgress } from "@react-three/drei";
import Lenis from "lenis"; // Importăm motorul de smooth scroll
import { BackgroundScene, MoonCanvas } from "./components/SpaceScene";

export default function Home() {
  // --- SCROLL ANIMATIONS ---
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);

  // --- FORM STATE ---
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // --- 3D LOADER STATE ---
  const { progress } = useProgress(); 
  const [isLoaded, setIsLoaded] = useState(false);

  // ==========================================
  // ⚙️ INITIALIZARE SCROLL FLUID & REFRESH TOP
  // ==========================================
  useEffect(() => {
    // 1. Forțează pagina să înceapă mereu de la 0 (sus) la refresh
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    // 2. Inițializează Lenis pentru acel "Scroll Pace" perfect
    const lenis = new Lenis({
      duration: 1.2, // Ritmul: 1.2 secunde (nici prea rapid, nici prea încet)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curba de frânare fină
      smoothWheel: true,
      wheelMultiplier: 1, // Viteza rotiței de la mouse
      touchMultiplier: 2, // Viteza pe ecrane touch
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy(); // Curățăm memoria dacă ieșim de pe pagină
    };
  }, []);

  // --- LOADING DELAY PENTRU 3D ---
  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setIsLoaded(true), 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  // ==========================================
  // 🚀 EMAILJS SUBMISSION LOGIC
  // ==========================================
  console.log("Verificare cheie:", process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
  const sendEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setFormStatus("sending");

    // Folosim direct string-urile pentru a testa dacă problema este fișierul .env
    emailjs.sendForm(
      "service_tf7366k",
      "template_z8zub67",
      formRef.current,
      "RfWSuRrx_3pI3KuMb"
    )
      .then(() => {
        setFormStatus("success");
        console.log("Trimis cu succes!");
      })
      .catch((error) => {
        // Dacă eroarea continuă să apară, vom vedea exact ce este
        console.error("DEBUG FINAL:", error);
        alert("Eroare trimitere: " + JSON.stringify(error));
        setFormStatus("error");
      });
  };

  const flowCards = [
    { title: "Strategy", description: "Data-driven blueprints designed to navigate complex algorithms and pinpoint your exact target audience." },
    { title: "Creativity", description: "High-impact, conversion-focused visual assets and copywriting that stand out like supernovas." },
    { title: "Scaling", description: "Aggressively optimized ad campaigns engineered to propel your revenue and business into deep space." }
  ];

  return (
    <>
      {/* ECRANUL DE PRELOADING */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          >
            <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <p className="mt-4 text-xs tracking-[0.4em] text-neutral-400 uppercase font-light">
              Initiating Orbit {Math.round(progress)}%
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative w-full bg-black text-white font-sans overflow-x-hidden">
        
        <BackgroundScene />

        <div className="relative z-10 w-full">

          {/* 1. HERO SECTION */}
          <section className="flex min-h-screen w-full flex-col items-center justify-center px-4">
            
            <motion.div style={{ opacity: heroOpacity, y: heroY }} className="flex flex-col items-center">
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={isLoaded ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <h1 
                  className="font-black uppercase tracking-tighter flex items-center justify-center drop-shadow-[0_15px_30px_rgba(0,0,0,1)]"
                  style={{ fontSize: "clamp(3rem, 10vw, 15rem)" }}
                >
                  <span 
                    className="text-transparent bg-clip-text bg-cover bg-center"
                    style={{ backgroundImage: "url('/text-texture.jpg')" }}
                  >
                    BRAND
                  </span>
                  
                  <MoonCanvas />
                  
                  <span 
                    className="text-transparent bg-clip-text bg-cover bg-center"
                    style={{ backgroundImage: "url('/text-texture.jpg')" }}
                  >
                    RBI
                    <span className="ml-[0.12em]">T</span>
                  </span>
                </h1>
                
                <p className="mt-4 text-sm md:text-xl text-neutral-300 uppercase tracking-[0.3em] font-light drop-shadow-md">
                  Launch Your Brand Into Orbit
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-10 flex flex-col items-center gap-2 opacity-50 pointer-events-none"
            >
              <span className="text-xs tracking-[0.2em] uppercase">Scroll to Explore</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
            </motion.div>
          </section>

          {/* 2. FLOW / FEATURES SECTION */}
          <section className="flex min-h-screen w-full items-center justify-center px-4 py-20 pointer-events-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
              {flowCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: idx * 0.2 }}
                  className="p-10 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl shadow-2xl hover:bg-black/70 transition-colors"
                >
                  <h3 className="text-3xl font-bold mb-4 tracking-wider uppercase text-white">{card.title}</h3>
                  <p className="text-neutral-300 leading-relaxed font-light text-lg">
                    {card.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* 3. CONTACT SECTION */}
          <section className="flex min-h-[80vh] w-full items-center justify-center px-4 py-20 pointer-events-auto bg-gradient-to-t from-black via-black/80 to-transparent">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full max-w-2xl p-10 md:p-14 rounded-3xl bg-black/80 border border-neutral-800 backdrop-blur-xl shadow-2xl"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-center uppercase tracking-widest text-white">
                Start Your Journey
              </h2>
              <form ref={formRef} onSubmit={sendEmail} className="flex flex-col gap-6">
                <input required type="text" name="user_name" className="bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="Name" />
                <input required type="email" name="user_email" className="bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="Email" />
                <textarea required name="message" rows={5} className="bg-neutral-900 border border-neutral-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/50 resize-none" placeholder="Message" />
                
                <button type="submit" disabled={formStatus === "sending"} className="mt-4 w-full bg-white text-black font-bold uppercase tracking-widest py-5 rounded-xl hover:bg-neutral-300 transition-colors disabled:opacity-50">
                  {formStatus === "sending" ? "Initiating Launch..." : "Launch Transmission"}
                </button>

                {formStatus === "success" && (
                  <p className="text-emerald-400 text-center mt-4 font-medium tracking-wide">Transmission successful. We will contact you shortly.</p>
                )}
                {formStatus === "error" && (
                  <p className="text-red-400 text-center mt-4 font-medium tracking-wide">Transmission failed. Please verify your comms and try again.</p>
                )}
              </form>
            </motion.div>
          </section>

        </div>
      </main>
    </>
  );
}