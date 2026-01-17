"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";

import HeroSection from "@/components/Hero-Section";
import AboutSection from "@/components/Home-AboutSection";
import JokerSection from "@/components/Home-JokerSection";
import ArtistsSection from "@/components/Artists";
import HallOfFame from "@/components/Home-HallOfFame";
import Footer from "@/components/ui/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavigationPanel from "@/components/ui/NavigationPanel";
import { Navbar } from "@/components/ui/Resizable-navbar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Dynamic import with SSR disabled to prevent "window is not defined" error
// from @react-three/fiber which accesses window at import time
const FluidCanvas = dynamic(() => import("@/components/FluidCanvas"), {
  ssr: false,
});

export default function HomeSection() {
  const [entered, setEntered] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  // const combineSectionRef = useRef<HTMLDivElement>(null);
  // const combineSvgRef = useRef<SVGSVGElement>(null);
  // const combinePathRef = useRef<SVGPathElement>(null);
  // const combineDotRef = useRef<HTMLDivElement>(null);

  // Refresh GSAP after .end mounts
  useEffect(() => {
    if (entered) {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }
  }, [entered]);

  // const generateViewportPath = useCallback(() => {
  //   if (typeof window === "undefined") return "";
  //   const w = window.innerWidth;
  //   const h = window.innerHeight;
  //   const sx = 1000 / w;
  //   const sy = 1000 / h;
  //   const startX = (w / 2) * sx;
  //   const startY = 0;
  //   const endX = (w / 2) * sx;
  //   const endY = 1000;
  //   const c1x = w * 0.15 * sx;
  //   const c1y = h * 0.35 * sy;
  //   const c2x = w * 0.85 * sx;
  //   const c2y = h * 0.65 * sy;

  //   return `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;
  // }, []);

  // const setupPaths = useCallback(() => {
  //   if (combinePathRef.current) {
  //     const path = generateViewportPath();
  //     combinePathRef.current.setAttribute("d", path);
  //   }
  // }, [generateViewportPath]);
  // useEffect(() => {
  //   if (
  //     combineSvgRef.current &&
  //     combinePathRef.current &&
  //     combineDotRef.current
  //   ) {
  //     const combineSvg = combineSvgRef.current;
  //     const combinePath = combinePathRef.current;
  //     const combineDot = combineDotRef.current;

  //     const path = generateViewportPath();
  //     combinePath.setAttribute("d", path);

  //     const combinePathLength = combinePath.getTotalLength();

  //     const combineTl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: combineSectionRef.current,
  //         start: "top top",
  //         end: "+=100%",
  //         pin: true,
  //         pinSpacing: false,
  //         scrub: 2.5,
  //         invalidateOnRefresh: true,
  //         onUpdate: (self) => {
  //           const progress = self.progress;
  //           const point = combinePath.getPointAtLength(
  //             combinePathLength * progress
  //           );
  //           const rect = combineSvg.getBoundingClientRect();
  //           const x = rect.left + (point.x / 1000) * rect.width;
  //           const y = rect.top + (point.y / 1000) * rect.height;

  //           combineDot.style.left = `${x}px`;
  //           combineDot.style.top = `${y}px`;
  //         },
  //         onEnter: () => {
  //           combineDot.style.opacity = "1";

  //         },
  //         onLeave: () => {
  //           combineDot.style.opacity = "0";
  //         },
  //         onEnterBack: () => {
  //           combineDot.style.opacity = "1";
  //         },
  //       },
  //     });

  //     const handleResize = () => {
  //       const newPath = generateViewportPath();
  //       combinePath.setAttribute("d", newPath);

  //       // Re-calculate positions on resize so mobile/desktop switch works dynamically
  //       combineTl.scrollTrigger?.refresh();
  //     };

  //     window.addEventListener("resize", handleResize);

  //     return () => {
  //       window.removeEventListener("resize", handleResize);
  //       combineTl.scrollTrigger?.kill();
  //       ScrollTrigger.getAll().forEach((trigger) => {
  //         if (trigger.trigger === combineSectionRef.current) {
  //           trigger.kill();
  //         }
  //       });
  //     };
  //   }
  // }, [generateViewportPath, setShowNavbar]);

  // const moveDot = useCallback((progress: number) => {
  //   if (
  //     !combinePathRef.current ||
  //     !combineSvgRef.current ||
  //     !combineDotRef.current
  //   ) return;

  //   const path = combinePathRef.current;
  //   const svg = combineSvgRef.current;
  //   const dot = combineDotRef.current;

  //   const length = path.getTotalLength();
  //   const point = path.getPointAtLength(length * progress);
  //   const rect = svg.getBoundingClientRect();

  //   dot.style.left = `${rect.left + (point.x / 1000) * rect.width}px`;
  //   dot.style.top = `${rect.top + (point.y / 1000) * rect.height}px`;
  // }, []);

  // useEffect(() => {
  //   const handler = (e: any) => moveDot(e.detail);
  //   window.addEventListener("dot-progress", handler);

  //   return () => window.removeEventListener("dot-progress", handler);
  // }, [moveDot]);

  return (
    <main className="flex flex-col min-h-svh relative">
      {entered ? <FluidCanvas /> : ""}
      <Navbar visible={showNavbar}>
        <NavigationPanel />
      </Navbar>
      <HeroSection
        onEnter={() => setEntered(true)}
        setShowNavbar={setShowNavbar}
        showNavbar={showNavbar}
      />
      <div
        className={`
            mt-[300svh]
            w-full
            flex-col
            z-30
            ${entered ? "flex" : "hidden"}
          `}
      >
        <AboutSection />
        <JokerSection setShowNavbar={setShowNavbar} showNavbar={showNavbar} />
        <ArtistsSection />
        {/* <div className="relative"
        id="combineSection" ref={combineSectionRef}>
        <svg
          id="combinePath"
          width="100%"
          height="100svh"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 pointer-events-none z-5"
          ref={combineSvgRef}
        >
          <path
            id="combineSvgPath"
            stroke="white"
            strokeWidth="2"
            fill="none"
            ref={combinePathRef}
          />
        </svg>

        <div
          id="combinePathDot"
          className="fixed w-14 h-14 md:w-22.5 md:h-22.5 bg-[#ff0000] rounded-full blur-[15px] md:blur-[20px] pointer-events-none z-5 opacity-0 -translate-x-1/2 -translate-y-1/2"
          ref={combineDotRef}
        ></div>
      </div> */}
        <HallOfFame />
        <Footer />
      </div>
    </main>
  );
}
