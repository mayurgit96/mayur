import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FALLBACK_IMAGE = "https://images.pexels.com/photos/13296066/pexels-photo-13296066.jpeg";

export default function HeroSlider({ images = [], interval = 3, children }) {
  const validImages = (images || []).filter((img) => img && typeof img === "string");
  const slides = validImages.length > 0 ? validImages : [FALLBACK_IMAGE];
  const [activeIdx, setActiveIdx] = useState(0);
  const timerRef = useRef(null);
  const intervalMs = Math.max(2, Number(interval) || 3) * 1000;

  const goTo = (idx) => setActiveIdx(((idx % slides.length) + slides.length) % slides.length);
  const next = () => goTo(activeIdx + 1);
  const prev = () => goTo(activeIdx - 1);

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return undefined;
    timerRef.current = setTimeout(() => {
      setActiveIdx((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearTimeout(timerRef.current);
  }, [activeIdx, slides.length, intervalMs]);

  return (
    <div data-testid="hero-slider" className="absolute inset-0 overflow-hidden">
      {/* Slides */}
      {slides.map((src, idx) => (
        <div
          key={`${idx}-${src.slice(0, 32)}`}
          data-testid={`hero-slide-${idx}`}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === activeIdx ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={idx !== activeIdx}
        >
          <img
            src={src}
            alt={`Hero slide ${idx + 1}`}
            className="w-full h-full object-cover"
            loading={idx === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 pointer-events-none"></div>

      {/* Hero content overlay (passed via children) */}
      {children}

      {/* Controls - only show if more than 1 image */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            data-testid="hero-slider-prev"
            aria-label="Previous slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/40 hover:bg-[#FF6A00] text-white border border-white/30 hover:border-[#FF6A00] transition-colors backdrop-blur-sm"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={next}
            data-testid="hero-slider-next"
            aria-label="Next slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-black/40 hover:bg-[#FF6A00] text-white border border-white/30 hover:border-[#FF6A00] transition-colors backdrop-blur-sm"
          >
            <ChevronRight size={22} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                data-testid={`hero-slider-dot-${idx}`}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === activeIdx ? "w-8 bg-[#FF6A00]" : "w-3 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
