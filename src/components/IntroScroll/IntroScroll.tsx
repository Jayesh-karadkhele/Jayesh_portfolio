import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import "./IntroScroll.css";

gsap.registerPlugin(ScrollTrigger);

type IntroScrollProps = {
  onFinish: () => void;
};

export default function IntroScroll({ onFinish }: IntroScrollProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prevOverflow = document.body.style.overflowY;
    const prevOverflowX = document.body.style.overflowX;
    document.body.style.overflowY = "auto";
    document.body.style.overflowX = "hidden";

    const lenis = new Lenis({
      // Lower duration = less “lag” feeling on scroll
      duration: 0.75,
      smoothWheel: true,
      syncTouch: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!context) return;

    const drawImageProp = (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      offsetX = 0.5,
      offsetY = 0.5
    ) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      let iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,
        nh = ih * r,
        cx,
        cy,
        cw,
        ch,
        ar = 1;

      if (nw < w) ar = w / nw;
      if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
      nw *= ar;
      nh *= ar;

      cw = iw / (nw / w);
      ch = ih / (nh / h);
      cx = (iw - cw) * offsetX;
      cy = (ih - ch) * offsetY;

      if (cx < 0) cx = 0;
      if (cy < 0) cy = 0;
      if (cw > iw) cw = iw;
      if (ch > ih) ch = ih;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, cx, cy, cw, ch, 0, 0, w, h);
    };

    const sequences = [
      { folder: "s1", frameCount: 240, sectionId: "#intro-section-1" },
      { folder: "s2", frameCount: 240, sectionId: "#intro-section-2" },
      { folder: "s3", frameCount: 240, sectionId: "#intro-section-3" },
    ];

    // Progressive image loading:
    // Loading 720 frames up-front causes big stalls on weaker devices.
    // We keep a small LRU-ish cache and prefetch a short window around the current frame.
    const imageCache = new Map<string, HTMLImageElement>();
    const cacheOrder: string[] = [];
    const MAX_CACHE = 80;
    const PREFETCH_AHEAD = 8;
    const PREFETCH_BEHIND = 4;

    let currentSeqIndex = 0;
    let currentFrameIndex = 0;
    let rafQueued = false;
    let lastRenderedKey = "";

    const pad = (number: number, length: number) => {
      let str = "" + number;
      while (str.length < length) str = "0" + str;
      return str;
    };

    const getFrameUrl = (seqIndex: number, frameIndex: number) => {
      const seq = sequences[seqIndex];
      const frame = Math.min(Math.max(frameIndex, 0), seq.frameCount - 1) + 1; // 1-based filenames
      return `/sequence/${seq.folder}/ezgif-frame-${pad(frame, 3)}.jpg`;
    };

    const touchCacheKey = (key: string) => {
      const idx = cacheOrder.indexOf(key);
      if (idx !== -1) cacheOrder.splice(idx, 1);
      cacheOrder.push(key);
    };

    const enforceCacheLimit = () => {
      while (cacheOrder.length > MAX_CACHE) {
        const oldest = cacheOrder.shift();
        if (oldest) imageCache.delete(oldest);
      }
    };

    const getImage = (seqIndex: number, frameIndex: number) => {
      const key = `${seqIndex}:${frameIndex}`;
      const existing = imageCache.get(key);
      if (existing) {
        touchCacheKey(key);
        return existing;
      }
      const img = new Image();
      img.decoding = "async";
      img.src = getFrameUrl(seqIndex, frameIndex);
      img.onload = () => {
        // If the image we were waiting on becomes ready, render next frame.
        requestRender();
      };
      imageCache.set(key, img);
      cacheOrder.push(key);
      enforceCacheLimit();
      return img;
    };

    const prefetchWindow = (seqIndex: number, frameIndex: number) => {
      const start = Math.max(0, frameIndex - PREFETCH_BEHIND);
      const end = Math.min(sequences[seqIndex].frameCount - 1, frameIndex + PREFETCH_AHEAD);
      for (let f = start; f <= end; f++) getImage(seqIndex, f);
    };

    const render = () => {
      const key = `${currentSeqIndex}:${currentFrameIndex}`;
      if (key === lastRenderedKey) return;
      const img = getImage(currentSeqIndex, currentFrameIndex);
      if (img && img.complete) {
        drawImageProp(context, img);
        lastRenderedKey = key;
        prefetchWindow(currentSeqIndex, currentFrameIndex);
      } else {
        prefetchWindow(currentSeqIndex, currentFrameIndex);
      }
    };

    const requestRender = () => {
      if (rafQueued) return;
      rafQueued = true;
      requestAnimationFrame(() => {
        rafQueued = false;
        render();
      });
    };

    const resizeCanvas = () => {
      // Cap DPR to avoid huge canvas work on high-DPI screens
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      context.resetTransform();
      context.scale(dpr, dpr);
      lastRenderedKey = "";
      requestRender();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Prime first frame quickly.
    const first = getImage(0, 0);
    if (first.complete) requestRender();
    else first.onload = requestRender;

    const triggers: ScrollTrigger[] = [];

    sequences.forEach((seq, index) => {
      const obj = { frame: 0 };
      const tween = gsap.to(obj, {
        frame: seq.frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: seq.sectionId,
          start: "top top",
          end: "bottom top",
          // Lower scrub = more responsive (less “sticky”)
          scrub: 0.25,
          onUpdate: () => {
            currentSeqIndex = index;
            currentFrameIndex = Math.round(obj.frame);
            requestRender();
          },
        },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    gsap.set("#intro-text-1", { opacity: 1 });

    sequences.forEach((seq, index) => {
      const trigger = ScrollTrigger.create({
        trigger: seq.sectionId,
        start: "top 60%",
        end: "bottom 60%",
        onEnter: () =>
          gsap.to(`#intro-text-${index + 1}`, {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          }),
        onLeave: () =>
          gsap.to(`#intro-text-${index + 1}`, {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
          }),
        onEnterBack: () =>
          gsap.to(`#intro-text-${index + 1}`, {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          }),
        onLeaveBack: () => {
          if (index !== 0)
            gsap.to(`#intro-text-${index + 1}`, {
              opacity: 0,
              duration: 1,
              ease: "power2.out",
            });
        },
      });
      triggers.push(trigger);
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      lenis.destroy();
      triggers.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((t) => t.kill());
      document.body.style.overflowY = prevOverflow;
      document.body.style.overflowX = prevOverflowX;
    };
  }, []);

  const finish = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    onFinish();
  };

  return (
    <div className="intro-hero-container">
      <button type="button" className="intro-skip-button" onClick={finish}>
        Skip intro
      </button>

      <div className="intro-canvas-container">
        <canvas ref={canvasRef} className="intro-canvas" />
      </div>

      <div className="intro-fixed-text-container">
        <div className="intro-fixed-text" id="intro-text-1">
          <h2>Hello! I am Jayesh Karadkhele.</h2>
          <p>Welcome to my portfolio. Scroll down to explore my journey and work.</p>
        </div>
        <div className="intro-fixed-text" id="intro-text-2">
          <h2>Build. Ship. Iterate.</h2>
          <p>From backend systems to polished UI, I focus on clean and scalable delivery.</p>
        </div>
        <div className="intro-fixed-text" id="intro-text-3">
          <h2>Let’s get into the portfolio.</h2>
          <p>You can continue to the main site anytime.</p>
        </div>
      </div>

      <main className="intro-scroll-content">
        <section className="intro-sequence-section" id="intro-section-1" />
        <section className="intro-sequence-section" id="intro-section-2" />
        <section className="intro-sequence-section" id="intro-section-3" />
        <section className="intro-end-section" id="intro-end">
          <div className="intro-end-card">
            <div className="intro-end-title">That’s the intro.</div>
            <div className="intro-end-subtitle">Next: the portfolio site.</div>
            <button type="button" className="intro-continue-button" onClick={finish}>
              Continue
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

