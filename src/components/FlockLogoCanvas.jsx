import React, { useEffect, useRef } from 'react';

/**
 * FlockLogoCanvas:
 * A seamless, full-bleed centerpiece canvas integrated directly into the Hero section.
 * Renders a murmuration flock of glowing dot particles flying organically across the hero stage
 * and smoothly converging into the centered "CSA" formation.
 */
export default function FlockLogoCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let animationFrameId;
    let width = 0;
    let height = 0;
    let particles = [];
    let startTime = performance.now();
    let scatterImpulseTime = -9999;
    let mouse = {
      x: -9999,
      y: -9999,
      vx: 0,
      vy: 0,
      prevX: -9999,
      prevY: -9999,
      active: false,
      radius: 135,
    };

    // Smooth cubic easing function
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Sample points for a large, centered "CSA" across the hero stage
    const generateCSATargets = (w, h) => {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = w;
      offCanvas.height = h;
      const offCtx = offCanvas.getContext('2d');

      offCtx.clearRect(0, 0, w, h);

      // Large, commanding centered CSA letters
      const fontSize = Math.min(w * 0.34, h * 0.62, 330);
      offCtx.fillStyle = '#ffffff';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.font = `800 ${fontSize}px "Plus Jakarta Sans", "Inter", sans-serif`;

      const centerX = w / 2;
      const centerY = h * 0.5;

      offCtx.fillText('CSA', centerX, centerY);

      const imgData = offCtx.getImageData(0, 0, w, h).data;
      const step = w < 640 ? 5 : 6;
      const points = [];

      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const idx = (y * w + x) * 4;
          if (imgData[idx + 3] > 140) {
            points.push({
              x: x + (Math.random() - 0.5) * 1.8,
              y: y + (Math.random() - 0.5) * 1.8,
            });
          }
        }
      }
      return points;
    };

    const initScene = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rawTargets = generateCSATargets(width, height);

      const maxDots = width < 640 ? 520 : 880;
      let selectedTargets = rawTargets;
      if (rawTargets.length > maxDots) {
        selectedTargets = [];
        const ratio = rawTargets.length / maxDots;
        for (let i = 0; i < maxDots; i++) {
          selectedTargets.push(rawTargets[Math.floor(i * ratio)]);
        }
      }

      // Sort targets from left-to-right so the flock flows smoothly into C -> S -> A
      selectedTargets.sort((a, b) => a.x - b.x);

      const palette = ['#ffffff', '#f8fafc', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8'];

      particles = selectedTargets.map((t, i) => {
        const progressRatio = i / selectedTargets.length;
        const flockCluster = i % 3;
        let startX, startY, initAngle;

        if (flockCluster === 0) {
          startX = width * 0.08 + Math.random() * (width * 0.35);
          startY = height * 0.15 + Math.random() * (height * 0.7);
          initAngle = -0.15 + (Math.random() - 0.5) * 0.5;
        } else if (flockCluster === 1) {
          startX = width * 0.55 + Math.random() * (width * 0.38);
          startY = height * 0.15 + Math.random() * (height * 0.7);
          initAngle = Math.PI + 0.15 + (Math.random() - 0.5) * 0.5;
        } else {
          startX = width * 0.25 + Math.random() * (width * 0.5);
          startY = height * 0.2 + Math.random() * (height * 0.65);
          initAngle = -Math.PI * 0.35 + (Math.random() - 0.5) * 0.6;
        }

        const speed = 2.4 + Math.random() * 1.6;

        return {
          x: startX,
          y: startY,
          vx: Math.cos(initAngle) * speed,
          vy: Math.sin(initAngle) * speed,
          tx: t.x,
          ty: t.y,
          formationDelay: progressRatio * 1100 + Math.random() * 450,
          color: palette[i % palette.length],
          radius: 1.6 + Math.random() * 1.35,
          pulsePhase: Math.random() * Math.PI * 2,
          maxSpeed: 3.2 + Math.random() * 1.1,
          morph: 0,
        };
      });

      startTime = performance.now();
    };

    initScene();

    const drawDotParticle = (p, tSec) => {
      const pulse = 1 + Math.sin(tSec * 3 + p.pulsePhase) * 0.12;
      const r = p.radius * pulse;

      // Soft outer halo for bright cyan/white dots
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.22 + p.morph * 0.12;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 2.1, 0, Math.PI * 2);
      ctx.fill();

      // Crisp dot core
      ctx.globalAlpha = 0.88 + p.morph * 0.12;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;
    };

    const animate = (now) => {
      const elapsedMs = now - startTime;
      const timeSinceScatter = now - scatterImpulseTime;

      ctx.clearRect(0, 0, width, height);

      // Subtle atmospheric center glow behind the CSA dot swarm
      const radialGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.5,
        20,
        width / 2,
        height * 0.5,
        Math.max(width, height) * 0.45
      );
      radialGrad.addColorStop(0, 'rgba(14, 165, 233, 0.11)');
      radialGrad.addColorStop(0.55, 'rgba(12, 24, 54, 0.04)');
      radialGrad.addColorStop(1, 'rgba(4, 8, 20, 0)');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Free murmuration for the first 2.3 seconds (or for 2.6 seconds after user clicks to release flock)
      const isFreeFlocking = elapsedMs < 2300 || timeSinceScatter < 2600;
      const activeFormationTimer =
        timeSinceScatter < 2600
          ? 0
          : scatterImpulseTime > 0
          ? timeSinceScatter - 2600
          : Math.max(0, elapsedMs - 2300);

      // Two figure-eight aerial attractors for graceful murmuration flight
      const tSec = now * 0.001;
      const leader1X = width * 0.5 + Math.cos(tSec * 1.15) * (width * 0.28);
      const leader1Y = height * 0.5 + Math.sin(tSec * 1.7) * (height * 0.24);
      const leader2X = width * 0.5 + Math.cos(tSec * 0.95 + Math.PI) * (width * 0.26);
      const leader2Y = height * 0.5 + Math.sin(tSec * 1.45 + Math.PI) * (height * 0.22);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Calculate individual convergence blend (0 = pure boid flight, 1 = guided arrival into CSA)
        let rawProgress = 0;
        if (!isFreeFlocking) {
          rawProgress = Math.min(
            1,
            Math.max(0, (activeFormationTimer - p.formationDelay) / 2400)
          );
        }
        const formationStrength = easeInOutCubic(rawProgress);

        // --- 1. BOIDS FLOCKING FORCES ---
        const leaderX = i % 2 === 0 ? leader1X : leader2X;
        const leaderY = i % 2 === 0 ? leader1Y : leader2Y;
        const dxL = leaderX - p.x;
        const dyL = leaderY - p.y;
        const distL = Math.hypot(dxL, dyL) || 1;

        let flockAx = (dxL / distL) * 0.1;
        let flockAy = (dyL / distL) * 0.1;

        // Smooth curl flow field so the dot swarm banks in sweeping arcs
        const flowAngle =
          Math.sin(p.x * 0.006 + tSec * 1.1) * Math.cos(p.y * 0.006 + tSec * 0.9) * Math.PI;
        flockAx += Math.cos(flowAngle) * 0.07;
        flockAy += Math.sin(flowAngle) * 0.07;

        // Local neighbor separation & alignment
        for (let j = 1; j <= 4; j++) {
          const nb = particles[(i + j * 17) % particles.length];
          const ndx = p.x - nb.x;
          const ndy = p.y - nb.y;
          const ndSq = ndx * ndx + ndy * ndy;
          if (ndSq > 0 && ndSq < 780) {
            const sep = 0.18 / Math.sqrt(ndSq);
            flockAx += ndx * sep;
            flockAy += ndy * sep;
          } else if (ndSq < 3600) {
            flockAx += (nb.vx - p.vx) * 0.022;
            flockAy += (nb.vy - p.vy) * 0.022;
          }
        }

        // Soft boundary turn-in
        const margin = 50;
        if (p.x < margin) flockAx += 0.22;
        if (p.x > width - margin) flockAx -= 0.22;
        if (p.y < margin) flockAy += 0.22;
        if (p.y > height - margin) flockAy -= 0.22;

        // --- 2. SMOOTH ARRIVAL STEERING TOWARD "CSA" TARGET ---
        const hoverX = Math.sin(tSec * 1.8 + p.ty * 0.05) * 0.85;
        const hoverY = Math.cos(tSec * 1.5 + p.tx * 0.05) * 0.85;
        const targetX = p.tx + hoverX;
        const targetY = p.ty + hoverY;

        const dxT = targetX - p.x;
        const dyT = targetY - p.y;
        const distT = Math.hypot(dxT, dyT);

        // Smooth arrival deceleration inside slowing radius
        const slowingRadius = 150;
        const desiredSpeed =
          distT > slowingRadius
            ? p.maxSpeed * 1.15
            : p.maxSpeed * 1.15 * (distT / slowingRadius);

        const desiredVx = distT > 0.5 ? (dxT / distT) * desiredSpeed : 0;
        const desiredVy = distT > 0.5 ? (dyT / distT) * desiredSpeed : 0;

        const steerAx = (desiredVx - p.vx) * 0.085;
        const steerAy = (desiredVy - p.vy) * 0.085;

        // Continuous blend between free flocking and arrival steering
        p.vx += flockAx * (1 - formationStrength) + steerAx * formationStrength;
        p.vy += flockAy * (1 - formationStrength) + steerAy * formationStrength;

        // --- 3. INTERACTIVE CURSOR SWOOP / SCATTER ---
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < mouse.radius && mdist > 0) {
            const influence = Math.pow(1 - mdist / mouse.radius, 1.6);
            p.vx += (mdx / mdist) * influence * 2.4 + mouse.vx * influence * 0.18;
            p.vy += (mdy / mdist) * influence * 2.4 + mouse.vy * influence * 0.18;
            p.morph = Math.max(0, p.morph - influence * 0.45);
          }
        }

        // Enforce maximum flight speed
        const currentSpeed = Math.hypot(p.vx, p.vy);
        const currentMax = p.maxSpeed * (1.15 - formationStrength * 0.15);
        if (currentSpeed > currentMax) {
          p.vx = (p.vx / currentSpeed) * currentMax;
          p.vy = (p.vy / currentSpeed) * currentMax;
        } else if (formationStrength < 0.15 && currentSpeed < 1.5) {
          p.vx *= 1.04;
          p.vy *= 1.04;
        }

        p.x += p.vx;
        p.y += p.vy;

        const proximityMorph =
          formationStrength > 0.5 && distT < 45
            ? Math.min(1, (1 - distT / 45) * formationStrength)
            : 0;
        p.morph += (proximityMorph - p.morph) * 0.065;

        drawDotParticle(p, tSec);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      initScene();
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;
      if (mouse.prevX > -9000) {
        mouse.vx = nx - mouse.prevX;
        mouse.vy = ny - mouse.prevY;
      }
      mouse.prevX = nx;
      mouse.prevY = ny;
      mouse.x = nx;
      mouse.y = ny;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.prevX = -9999;
      mouse.prevY = -9999;
      mouse.vx = 0;
      mouse.vy = 0;
    };

    const handleClick = () => {
      scatterImpulseTime = performance.now();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const angle = Math.atan2(p.vy, p.vx) + (Math.random() - 0.5) * 1.2;
        const burst = 2.4 + Math.random() * 1.5;
        p.vx = Math.cos(angle) * burst;
        p.vy = Math.sin(angle) * burst;
      }
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="relative w-full h-[360px] sm:h-[460px] md:h-[520px] flex items-center justify-center select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer"
      />
    </div>
  );
}
