"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { vertexShaderSource, fragmentShaderSource } from "@/lib/shaders";
import {
  createWebGLContext,
  compileShader,
  linkProgram,
  createFullScreenQuad,
  loadTexture,
} from "@/lib/webgl-utils";

interface WatercolorCanvasProps {
  imageSrc: string;
  watercolorSrc: string;
  imageAlt: string;
  className?: string;
  priority?: boolean;
}

export default function WatercolorCanvas({
  imageSrc,
  watercolorSrc,
  imageAlt,
  className,
  priority,
}: WatercolorCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglReady, setWebglReady] = useState(false);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const lastProgressRef = useRef(-1);
  const uniformsRef = useRef<{
    u_progress: WebGLUniformLocation | null;
    u_resolution: WebGLUniformLocation | null;
    u_noise_scale: WebGLUniformLocation | null;
    u_photo: WebGLUniformLocation | null;
    u_watercolor: WebGLUniformLocation | null;
  } | null>(null);

  const updateSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const gl = glRef.current;
    if (!canvas || !container || !gl) return;

    const rect = container.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    const scaleFactor = isMobile ? 0.5 : 0.75;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const scale = dpr * scaleFactor;

    const w = Math.round(rect.width * scale);
    const h = Math.round(rect.height * scale);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      if (uniformsRef.current?.u_resolution) {
        gl.uniform2f(uniformsRef.current.u_resolution, w, h);
      }
      lastProgressRef.current = -1; // force redraw
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = createWebGLContext(canvas);
    if (!gl) return; // fallback to <img>

    glRef.current = gl;

    let program: WebGLProgram;
    try {
      const vs = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
      program = linkProgram(gl, vs, fs);
    } catch {
      return; // fallback
    }

    gl.useProgram(program);
    createFullScreenQuad(gl, program);

    const uniforms = {
      u_progress: gl.getUniformLocation(program, "u_progress"),
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_noise_scale: gl.getUniformLocation(program, "u_noise_scale"),
      u_photo: gl.getUniformLocation(program, "u_photo"),
      u_watercolor: gl.getUniformLocation(program, "u_watercolor"),
    };
    uniformsRef.current = uniforms;

    gl.uniform1f(uniforms.u_noise_scale, 4.0);
    gl.uniform1i(uniforms.u_photo, 0);
    gl.uniform1i(uniforms.u_watercolor, 1);

    // Load textures
    Promise.all([
      loadTexture(gl, imageSrc),
      loadTexture(gl, watercolorSrc),
    ])
      .then(([photoTex, watercolorTex]) => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, photoTex);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, watercolorTex);

        updateSize();
        setWebglReady(true);
      })
      .catch(() => {
        // Texture load failed — stay on fallback
      });

    // IntersectionObserver to pause when off-screen
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(container);

    // ResizeObserver
    const ro = new ResizeObserver(() => updateSize());
    ro.observe(container);

    return () => {
      io.disconnect();
      ro.disconnect();
      // GL cleanup handled below in RAF cleanup
    };
  }, [imageSrc, watercolorSrc, updateSize]);

  // RAF loop — separate effect so it restarts when webglReady changes
  useEffect(() => {
    if (!webglReady) return;

    const gl = glRef.current;
    const container = containerRef.current;
    if (!gl || !container) return;

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (!isVisibleRef.current) return;

      // Find the outer scroll section (tall container with sticky content)
      const section = container.closest("section");
      const scrollEl = section || container;
      const rect = scrollEl.getBoundingClientRect();
      const scrollableDistance = scrollEl.offsetHeight - window.innerHeight;
      // If the section is taller than the viewport, use the extra height to drive progress
      // Otherwise fall back to 80% of container height
      const divisor = scrollableDistance > 0 ? scrollableDistance : container.offsetHeight * 0.8;
      const raw = -rect.top / divisor;
      const progress = Math.max(0, Math.min(1, raw));

      // Skip draw if unchanged
      if (Math.abs(progress - lastProgressRef.current) < 0.001) return;
      lastProgressRef.current = progress;

      gl.uniform1f(uniformsRef.current!.u_progress, progress);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [webglReady]);

  // Cleanup GL on unmount
  useEffect(() => {
    return () => {
      const gl = glRef.current;
      if (gl) {
        const ext = gl.getExtension("WEBGL_lose_context");
        ext?.loseContext();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className ?? ""}`}>
      {/* Fallback image — always in DOM for SSG/no-JS, hidden when WebGL active */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          webglReady ? "opacity-0" : "opacity-100"
        }`}
        {...(priority ? { fetchPriority: "high" } : {})}
      />
      {/* CSS gradient overlays for fallback (hidden when WebGL active, since shader has them baked in) */}
      {!webglReady && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A3F28]/80 via-[#2A3F28]/25 via-25% to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A3F28]/30 to-transparent" />
        </>
      )}
      {/* WebGL canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          webglReady ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
