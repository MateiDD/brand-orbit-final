"use client";

import { useRef, useState, FormEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import emailjs from "@emailjs/browser";
import { BackgroundScene, MoonCanvas } from "./components/SpaceScene";

export default function Home() {
  const { scrollY } = useScroll();
  // Hero text fades out as you scroll down
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);

  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const sendEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setFormStatus("sending");
    emailjs.sendForm("service_id", "template_id", formRef.current, "public_key")
      .then(() => setFormStatus("success"), () => setFormStatus("error"));
  };

  const flowCards = [
    { title: "Strategy", description: "Data-driven blueprints designed to navigate complex algorithms." },
    { title: "Creativity", description: "High-impact, conversion-focused visual assets and copywriting." },
    { title: "Scaling", description: "Aggressively optimized ad campaigns engineered to propel revenue." }
  ];

  return (
    <main className="relative w-full bg-black text-white font-sans overflow-x-hidden">
      
      {/* 3D BACKGROUND (Saturn rises when you scroll) */}
      <BackgroundScene />

      {/* UI OVERLAY */}
      <div className="relative z-10 w-full">

        {/* 1. HERO SECTION */}
        <section className="flex min-h-screen w-full flex-col items-center justify-center px-4">
          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="flex flex-col items-center"
          >
            <h1 
              className="font-black uppercase tracking-tighter flex items-center justify-center drop-shadow-[0_15px_30px_rgba(0,0,0,1)]"
              style={{ fontSize: "clamp(3rem, 10vw, 15rem)" }}
            >
              {/* TEXTURE APPLIED STRICTLY TO THE LETTERS */}
              <span 
                className="text-transparent bg-clip-text bg-cover bg-center"
                style={{ backgroundImage: "url('/text-texture.jpg')" }}
              >
                BRAND
              </span>
              
              {/* 3D MOON IN THE MIDDLE */}
              <MoonCanvas />
              
              <span 
                className="text-transparent bg-clip-text bg-cover bg-center"
                style={{ backgroundImage: "url('/text-texture.jpg')" }}
              >
                RBIT
              </span>
            </h1>
            
            <p className="mt-4 text-sm md:text-xl text-neutral-300 uppercase tracking-[0.3em] font-light drop-shadow-md">
              Launch Your Brand Into Orbit
            </p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 flex flex-col items-center gap-2 opacity-50"
          >
            <span className="text-xs tracking-[0.2em] uppercase">Scroll to Explore</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
          </motion.div>
        </section>

        {/* 2. FLOW / FEATURES SECTION (Saturn appears behind this) */}
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
              <button type="submit" disabled={formStatus === "sending"} className="mt-4 w-full bg-white text-black font-bold uppercase tracking-widest py-5 rounded-xl hover:bg-neutral-300 transition-colors">
                Launch Transmission
              </button>
            </form>
          </motion.div>
        </section>

      </div>
    </main>
  );
}