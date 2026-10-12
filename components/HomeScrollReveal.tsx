// FAMZI FILE GUIDE: Client-side entrance animation wrapper for homepage sections.
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealVariant = "up" | "left" | "right" | "soft" | "scale";

export default function HomeScrollReveal({
  children,
  variant = "up",
}: {
  children: ReactNode;
  variant?: RevealVariant;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("has-scroll-reveal");
    const element = elementRef.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`home-scroll-reveal home-scroll-reveal--${variant}${isVisible ? " is-visible" : ""}`}
    >
      {children}
    </div>
  );
}
