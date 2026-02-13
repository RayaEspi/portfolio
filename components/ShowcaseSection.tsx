"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { PortfolioSection } from "@/types/portfolio";

interface ShowcaseSectionProps {
  section: PortfolioSection;
  index: number;
}

export function ShowcaseSection({ section, index }: ShowcaseSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    const amount = 300;
    carouselRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const isEven = index % 2 === 0;

  return (
    <section ref={ref} id={section.id} className="py-10 relative">
      <div
        className={`absolute top-16 ${isEven ? "right-8" : "left-8"} font-gothic text-[8rem] leading-none text-primary select-none pointer-events-none hidden lg:block`}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={`mb-10 ${isEven ? "text-left" : "text-right"}`}
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-3 italic">
            {section.title}
            <span className="text-primary">.</span>
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-lg leading-relaxed inline-block">
            {section.description}
          </p>
          <div
            className={`h-[2px] bg-primary/40 w-20 mt-4 ${isEven ? "" : "ml-auto"}`}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group"
        >
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-background border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>

          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          >
            {section.items.map((item, i) => (
              <motion.div
                key={`${section.id}-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="snap-start flex-shrink-0 w-64 sm:w-72 group/card"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div
                    className="gothic-border overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-cover bg-center bg-gradient-to-t from-black/70 to-transparent"
                >
                  <div className="gothic-spacer relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="hidden w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                    <div className="hidden absolute inset-0 bg-foreground/0 group-hover/card:bg-foreground/60 transition-colors duration-300 flex items-center justify-center">
                      <a
                        href={item.downloadUrl}
                        className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 gothic-border-pink bg-primary px-4 py-2 text-xs font-body uppercase tracking-widest text-primary-foreground flex items-center gap-2"
                      >
                        <Download size={14} />
                        Download
                      </a>
                    </div>
                  </div>
                  <div className="gothic-para p-4 bg-transparent">
                    <h3 className="font-display text-sm font-bold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
