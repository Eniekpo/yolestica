"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  CircleCheck,
} from "lucide-react";
import { services } from "@/content/services";
export function Hero() {
  const [index, setIndex] = useState(0),
    [paused, setPaused] = useState(false),
    [hover, setHover] = useState(false),
    [focused, setFocused] = useState(false),
    [reduced, setReduced] = useState(true),
    [announcement, setAnnouncement] = useState("");
  const touch = useRef<number | null>(null);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(q.matches);
    sync();
    q.addEventListener("change", sync);
    return () => q.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (paused || hover || focused || reduced) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % 8), 5500);
    return () => clearInterval(timer);
  }, [paused, hover, focused, reduced]);
  function go(next: number) {
    const n = (next + 8) % 8;
    setIndex(n);
    setAnnouncement(`Slide ${n + 1} of 8: ${services[n].name}`);
  }
  const s = services[index];
  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Our eight services"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current !== null) {
          const d = touch.current - e.changedTouches[0].clientX;
          if (Math.abs(d) > 60) go(index + (d > 0 ? 1 : -1));
          touch.current = null;
        }
      }}
    >
      <div className="site-container">
        <div
          className="hero-main"
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of 8`}
        >
          <div>
            <div className="eyebrow">Ideas into impact. That’s Yoletech.</div>
            <h1 data-long={s.key === "TUTORIALS"}>{s.name}</h1>
            <p>{s.caption}</p>
            <div className="hero-actions">
              <Link
                href={`/contact?service=${s.key}`}
                className="btn btn-primary"
              >
                Start your project <ArrowUpRight size={17} />
              </Link>
              <Link href={`/services#${s.slug}`} className="btn btn-secondary">
                Explore this service <ArrowRight size={15} />
              </Link>
            </div>
            <div className="hero-proof">
              <CircleCheck size={15} className="text-brand" />
              Built around your goals. Delivered with care.
            </div>
          </div>
          <Image
            className="hero-art"
            src={`/illustrations/services/${s.slug}.svg`}
            width={620}
            height={470}
            alt=""
            priority={index === 0}
          />
        </div>
        <div className="hero-bottom">
          <div className="carousel-controls">
            <button
              className="circle-button"
              aria-label="Previous service"
              onClick={() => go(index - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="circle-button"
              aria-label="Next service"
              onClick={() => go(index + 1)}
            >
              <ChevronRight size={16} />
            </button>
            <span className="ml-3 text-xs text-body" aria-hidden="true">
              0{index + 1}
              <span className="mx-2">/</span>08
            </span>
          </div>
          <div className="carousel-controls">
            {services.map((item, i) => (
              <button
                key={item.key}
                className="dot"
                aria-label={`Show ${item.name}`}
                aria-current={index === i}
                onClick={() => go(i)}
              />
            ))}
            <button
              className="circle-button ml-2"
              aria-label={
                paused || reduced ? "Play slideshow" : "Pause slideshow"
              }
              onClick={() => {
                if (reduced) {
                  setReduced(false);
                  setPaused(false);
                } else setPaused(!paused);
              }}
            >
              {paused || reduced ? <Play size={13} /> : <Pause size={13} />}
            </button>
          </div>
          <span className="hero-index text-[10px] uppercase tracking-widest">
            Technology with purpose
          </span>
        </div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
    </section>
  );
}
