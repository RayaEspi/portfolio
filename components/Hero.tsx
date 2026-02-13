"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <FloatingElements />

      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        <div className="flex-1 text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4"
          >
            Code · Model · Animate
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-gothic text-6xl sm:text-7xl lg:text-8xl text-foreground leading-none mb-6"
          >
            Raya
            <br />
            <span className="text-primary text-glow">Serahill</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="h-[2px] bg-primary w-32 mx-auto lg:mx-0 mb-6 origin-left"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="font-body text-sm text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed"
          >
            Creating stuff, from 3D models & animations to websites & plugins.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-8 flex gap-4 justify-center lg:justify-start"
          >
            <a
              href="#plugins"
              className="gothic-border-pink px-6 py-3 text-xs font-body uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
            >
              View Work
            </a>
            <a
              href="#"
              className="gothic-border px-6 py-3 text-xs font-body uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              Contact
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-1 flex justify-center relative"
        >
          <div className="relative">
            <div className="absolute -inset-4 border-2 border-primary/30 rotate-3" />
            <div className="absolute -inset-4 border-2 border-foreground/10 -rotate-2" />

            <div className="relative w-72 h-96 sm:w-80 sm:h-[28rem] bg-card border border-border flex items-center justify-center overflow-hidden bg-[url('/velvet/piccie.png')] bg-cover bg-center">
              <div className="text-center p-6 hidden">
                <div className="w-24 h-24 rounded-full border-2 border-primary/40 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-primary text-3xl font-gothic">R</span>
                </div>
                <p className="text-xs font-body text-muted-foreground uppercase tracking-widest">
                  Your photo here
                </p>
              </div>
              <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary" />
              <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary" />
              <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary" />
              <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-body uppercase tracking-widest text-muted-foreground">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-[1px] h-8 bg-primary/50"
        />
      </motion.div>
    </section>
  );
}

function FloatingElements() {
  return (
    <>
      <div className="absolute top-32 right-[15%] animate-float opacity-20">
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
          <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="2" />
          <line x1="0" y1="15" x2="40" y2="15" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute bottom-40 left-[10%] animate-float-reverse opacity-15">
        <svg width="30" height="30" viewBox="0 0 30 30" className="text-foreground">
          <polygon points="15,0 30,15 15,30 0,15" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="absolute top-[45%] left-[5%] animate-spin-slow opacity-10">
        <svg width="60" height="60" viewBox="0 0 60 60" className="text-primary">
          <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
      </div>

      <div className="absolute top-[20%] left-[25%] animate-pulse-pink">
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>
      <div className="absolute bottom-[30%] right-[20%] animate-pulse-pink" style={{ animationDelay: "1s" }}>
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      </div>
      <div className="absolute top-[60%] right-[8%] animate-pulse-pink" style={{ animationDelay: "2s" }}>
        <div className="w-2.5 h-2.5 rounded-full bg-primary/50" />
      </div>
    </>
  );
}
