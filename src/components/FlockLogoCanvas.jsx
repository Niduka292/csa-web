import React, { useEffect, useRef } from 'react';

/**
 * FlockLogoCanvas:
 * A seamless, full-bleed centerpiece canvas integrated directly into the Hero section.
 * Renders a murmuration flock of glowing dot particles flying organically across the hero stage
 * and smoothly converging into the official CSA emblem + "CSA" formation.
 */
export default function FlockLogoCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let isCancelled = false;
    let animationFrameId;
    let width = 0;
    let height = 0;
    let particles = [];
    let brainLinks = [];
    let maxSynapseRenderDistSq = 900;
    let startTime = performance.now();
    let scatterImpulseTime = -9999;
    let loadedIconImg = null;
    let loadedBrainImg = null;
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

    const downsamplePoints = (points, maxCount) => {
      if (points.length <= maxCount) return points;
      const sampled = [];
      const ratio = points.length / maxCount;
      for (let i = 0; i < maxCount; i++) {
        sampled.push(points[Math.floor(i * ratio)]);
      }
      return sampled;
    };

    const sampleTextTargets = (offCtx, w, h, step, jitter, maxCount) => {
      const imgData = offCtx.getImageData(0, 0, w, h).data;
      const points = [];

      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const idx = (y * w + x) * 4;
          if (imgData[idx + 3] > 125) {
            points.push({
              x: x + (Math.random() - 0.5) * jitter,
              y: y + (Math.random() - 0.5) * jitter,
              isIcon: false,
              isBrain: false,
              isRibbonAccent: false,
            });
          }
        }
      }

      return downsamplePoints(points, maxCount);
    };

    const sampleOuterIconTargets = (offCtx, w, h, centerX, centerY, iconSize, isMobile) => {
      const imgData = offCtx.getImageData(0, 0, w, h).data;
      const brainThreshold = iconSize * 0.2;
      const outerStep = isMobile ? 4 : 5;
      const minX = Math.max(0, Math.floor(centerX - iconSize / 2));
      const maxX = Math.min(w - 1, Math.ceil(centerX + iconSize / 2));
      const minY = Math.max(0, Math.floor(centerY - iconSize / 2));
      const maxY = Math.min(h - 1, Math.ceil(centerY + iconSize / 2));

      const outerPoints = [];

      for (let y = minY; y <= maxY; y += outerStep) {
        for (let x = minX; x <= maxX; x += outerStep) {
          const diamondDist = Math.abs(x - centerX) + Math.abs(y - centerY);
          if (diamondDist < brainThreshold) continue;

          const idx = (y * w + x) * 4;
          if (imgData[idx + 3] > 125) {
            const r = imgData[idx];
            const b = imgData[idx + 2];
            outerPoints.push({
              x: x + (Math.random() - 0.5) * 1.1,
              y: y + (Math.random() - 0.5) * 1.1,
              isIcon: true,
              isBrain: false,
              isRibbonAccent: b - r > 15,
            });
          }
        }
      }

      return downsamplePoints(outerPoints, isMobile ? 250 : 480);
    };

    const sampleBrainBubbleTargets = (offCtx, w, h, centerX, centerY, iconSize, isMobile) => {
      const imgData = offCtx.getImageData(0, 0, w, h).data;
      const halfBox = Math.ceil(iconSize * 0.28);
      const minX = Math.max(0, Math.floor(centerX - halfBox));
      const maxX = Math.min(w - 1, Math.ceil(centerX + halfBox));
      const minY = Math.max(0, Math.floor(centerY - halfBox));
      const maxY = Math.min(h - 1, Math.ceil(centerY + halfBox));

      const candidates = [];
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const idx = (y * w + x) * 4;
          const alpha = imgData[idx + 3];
          if (alpha > 90) {
            candidates.push({ x, y, alpha });
          }
        }
      }

      // Prioritize highest-alpha centerline pixels so bubbles trace the brain folds cleanly
      candidates.sort((a, b) => b.alpha - a.alpha);

      const minDist = isMobile ? 3.5 : 4.2;
      const minDistSq = minDist * minDist;
      const selected = [];

      for (let i = 0; i < candidates.length; i++) {
        const c = candidates[i];
        let tooClose = false;
        for (let j = selected.length - 1; j >= 0; j--) {
          const dx = c.x - selected[j].x;
          const dy = c.y - selected[j].y;
          if (dx * dx + dy * dy < minDistSq) {
            tooClose = true;
            break;
          }
        }
        if (!tooClose) {
          selected.push({
            x: c.x,
            y: c.y,
            isIcon: true,
            isBrain: true,
            isRibbonAccent: false,
          });
        }
      }

      return selected;
    };

    // Sample points for the centered [Official CSA Icon] + "CSA" lockup
    const generateCSATargets = (w, h, iconImg, brainImg) => {
      const cw = Math.max(1, Math.floor(w));
      const ch = Math.max(1, Math.floor(h));
      const offCanvas = document.createElement('canvas');
      offCanvas.width = cw;
      offCanvas.height = ch;
      const offCtx = offCanvas.getContext('2d');

      let fontSize = Math.min(cw * 0.25, ch * 0.56, 270);
      offCtx.font = `800 ${fontSize}px "Plus Jakarta Sans", "Inter", sans-serif`;
      let textWidth = offCtx.measureText('CSA').width;
      let iconSize = iconImg ? fontSize * 0.98 : 0;
      let gap = iconImg ? fontSize * 0.16 : 0;
      let totalWidth = iconSize + gap + textWidth;

      const maxLockupWidth = cw * 0.9;
      if (totalWidth > maxLockupWidth && totalWidth > 0) {
        const scale = maxLockupWidth / totalWidth;
        fontSize *= scale;
        iconSize *= scale;
        gap *= scale;
        offCtx.font = `800 ${fontSize}px "Plus Jakarta Sans", "Inter", sans-serif`;
        textWidth = offCtx.measureText('CSA').width;
        totalWidth = iconSize + gap + textWidth;
      }

      const startX = (cw - totalWidth) / 2;
      const centerY = ch * 0.5;
      const iconCenterX = startX + iconSize / 2;
      const isMobile = cw < 640;

      let iconPoints = [];
      if (iconImg) {
        offCtx.clearRect(0, 0, cw, ch);
        offCtx.drawImage(iconImg, startX, centerY - iconSize / 2, iconSize, iconSize);
        iconPoints = sampleOuterIconTargets(
          offCtx,
          cw,
          ch,
          iconCenterX,
          centerY,
          iconSize,
          isMobile
        );
      }

      let brainPoints = [];
      if (brainImg) {
        const brainDrawSize = iconSize * 1.04;
        offCtx.clearRect(0, 0, cw, ch);
        offCtx.drawImage(
          brainImg,
          iconCenterX - brainDrawSize / 2,
          centerY - brainDrawSize / 2,
          brainDrawSize,
          brainDrawSize
        );
        brainPoints = sampleBrainBubbleTargets(
          offCtx,
          cw,
          ch,
          iconCenterX,
          centerY,
          iconSize,
          isMobile
        );
      }

      offCtx.clearRect(0, 0, cw, ch);
      offCtx.fillStyle = '#ffffff';
      offCtx.textAlign = 'left';
      offCtx.textBaseline = 'middle';
      offCtx.font = `800 ${fontSize}px "Plus Jakarta Sans", "Inter", sans-serif`;
      offCtx.fillText('CSA', startX + iconSize + gap, centerY + fontSize * 0.03);

      const textPoints = sampleTextTargets(
        offCtx,
        cw,
        ch,
        isMobile ? 5 : 6,
        1.7,
        isMobile ? 400 : 720
      );

      return {
        targets: [...iconPoints, ...brainPoints, ...textPoints],
        iconSize,
      };
    };

    /** Precompute static nearest-neighbor links across settled brain fold nodes. */
    const buildBrainSynapseLinks = (particleList, iconSize) => {
      const brainIndices = [];
      for (let i = 0; i < particleList.length; i++) {
        if (particleList[i].isBrain) brainIndices.push(i);
      }
      if (brainIndices.length < 2) return [];

      const maxLinkDist = Math.max(14, (iconSize || 160) * 0.085);
      const maxLinkDistSq = maxLinkDist * maxLinkDist;
      maxSynapseRenderDistSq = Math.pow(maxLinkDist * 1.45, 2);

      const seen = new Set();
      const links = [];

      for (let i = 0; i < brainIndices.length; i++) {
        const idxA = brainIndices[i];
        const pa = particleList[idxA];
        const neighbors = [];

        for (let j = 0; j < brainIndices.length; j++) {
          if (i === j) continue;
          const idxB = brainIndices[j];
          const pb = particleList[idxB];
          const dx = pa.tx - pb.tx;
          const dy = pa.ty - pb.ty;
          const dSq = dx * dx + dy * dy;
          if (dSq > 0 && dSq <= maxLinkDistSq) {
            neighbors.push({ idxB, dSq });
          }
        }

        neighbors.sort((u, v) => u.dSq - v.dSq);
        const count = Math.min(3, neighbors.length);
        for (let k = 0; k < count; k++) {
          const idxB = neighbors[k].idxB;
          const key = idxA < idxB ? `${idxA}-${idxB}` : `${idxB}-${idxA}`;
          if (!seen.has(key)) {
            seen.add(key);
            links.push({
              a: idxA,
              b: idxB,
              phase: Math.random() * Math.PI * 2,
              pulseSpeed: 0.65 + Math.random() * 0.85,
              hasPulse: links.length % 3 === 0,
            });
          }
        }
      }

      return links;
    };

    const initScene = () => {
      if (isCancelled || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const { targets: selectedTargets, iconSize } = generateCSATargets(
        width,
        height,
        loadedIconImg,
        loadedBrainImg
      );

      // Sort targets from left-to-right so the flock flows smoothly into [Icon] -> C -> S -> A
      selectedTargets.sort((a, b) => a.x - b.x);

      const palette = ['#ffffff', '#f8fafc', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8'];

      particles = selectedTargets.map((t, i) => {
        const progressRatio = i / Math.max(1, selectedTargets.length);
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
          isIcon: !!t.isIcon,
          isBrain: !!t.isBrain,
          isRibbonAccent: !!t.isRibbonAccent,
          formationDelay: progressRatio * 1100 + Math.random() * 450,
          color: t.isRibbonAccent
            ? '#38bdf8'
            : t.isBrain
            ? '#bae6fd'
            : palette[i % palette.length],
          radius: t.isBrain ? 1.55 + Math.random() * 0.9 : 1.6 + Math.random() * 1.35,
          pulsePhase: Math.random() * Math.PI * 2,
          maxSpeed: 3.2 + Math.random() * 1.1,
          morph: 0,
        };
      });

      brainLinks = buildBrainSynapseLinks(particles, iconSize);
      startTime = performance.now();
    };

    const drawBrainSynapses = (tSec) => {
      if (brainLinks.length === 0) return;

      ctx.lineCap = 'round';
      ctx.lineWidth = 0.85;

      for (let i = 0; i < brainLinks.length; i++) {
        const link = brainLinks[i];
        const pa = particles[link.a];
        const pb = particles[link.b];
        const linkMorph = Math.min(pa.morph, pb.morph);
        if (linkMorph < 0.35) continue;

        const dx = pb.x - pa.x;
        const dy = pb.y - pa.y;
        if (dx * dx + dy * dy > maxSynapseRenderDistSq) continue;

        const pulse = 0.5 + 0.5 * Math.sin(tSec * 2.3 + link.phase);
        ctx.strokeStyle = '#38bdf8';
        ctx.globalAlpha = linkMorph * (0.13 + pulse * 0.24);
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();

        // Traveling synaptic signal spark along settled brain fold edges
        if (link.hasPulse && linkMorph > 0.7) {
          const u = (tSec * link.pulseSpeed + link.phase) % 1;
          const sx = pa.x + dx * u;
          const sy = pa.y + dy * u;

          ctx.fillStyle = '#7dd3fc';
          ctx.globalAlpha = linkMorph * 0.35;
          ctx.beginPath();
          ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = linkMorph * 0.85;
          ctx.beginPath();
          ctx.arc(sx, sy, 1.05, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
    };

    const drawParticle = (p, tSec) => {
      const speed = Math.hypot(p.vx, p.vy);
      const birdAmount = 1 - p.morph;

      // Gentle left-to-right shimmer wave across the settled CSA formation
      const waveRaw = Math.sin(tSec * 2.1 - p.tx * 0.011);
      const shimmer = Math.pow(Math.max(0, waveRaw), 7) * p.morph;

      const pulse = 1 + Math.sin(tSec * 3 + p.pulsePhase) * 0.12;
      const r = p.radius * pulse * (1 + shimmer * 0.38);

      // Moving state: sideways flying bird silhouette with full up/down wingbeat, glide, and body bob
      if (birdAmount > 0.04) {
        const facing = p.vx < 0 ? -1 : 1;
        const flapPhase = tSec * (8.5 + speed * 1.1) + p.pulsePhase;
        const glideWave = 0.65 + 0.35 * Math.sin(tSec * 1.4 + p.pulsePhase * 1.7);
        const stroke = Math.sin(flapPhase) * glideWave + (1 - glideWave) * 0.55;

        const up = Math.max(0, stroke);
        const down = Math.max(0, -stroke);
        const tilt = Math.atan2(p.vy, Math.max(0.4, Math.abs(p.vx))) * 0.65 + stroke * 0.08;
        const bobY = -stroke * 0.16;
        const birdScale = (4.6 + r * 1.35) * (0.35 + 0.65 * birdAmount);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(facing * birdScale, birdScale);
        ctx.rotate(tilt);
        ctx.translate(0, bobY);

        // Soft aerial glow behind flying bird
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.08 * birdAmount;
        ctx.beginPath();
        ctx.arc(0, 0, 1.35, 0, Math.PI * 2);
        ctx.fill();

        // Unified side-profile bird silhouette (upstroke above back, downstroke below chest)
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.88 * birdAmount;
        ctx.beginPath();
        ctx.moveTo(-1.05, 0.42);

        if (down > 0.02) {
          // Belly transitions smoothly into downward-sweeping 3-feather wingbeat
          ctx.quadraticCurveTo(-0.72, 0.52, -0.42, 0.55);
          ctx.quadraticCurveTo(
            -0.52 - 0.1 * down,
            0.55 + 0.14 * down,
            -0.42 - 0.18 * down,
            0.55 + 0.28 * down
          );
          ctx.quadraticCurveTo(-0.36, 0.56 + 0.2 * down, -0.3, 0.56 + 0.18 * down);
          ctx.quadraticCurveTo(
            -0.42 - 0.18 * down,
            0.57 + 0.38 * down,
            -0.36 - 0.26 * down,
            0.57 + 0.56 * down
          );
          ctx.quadraticCurveTo(-0.28, 0.58 + 0.44 * down, -0.22, 0.57 + 0.42 * down);
          ctx.quadraticCurveTo(
            -0.32 - 0.22 * down,
            0.58 + 0.68 * down,
            -0.22 - 0.3 * down,
            0.58 + 0.9 * down
          );
          ctx.quadraticCurveTo(0.18, 0.62 + 0.22 * down, 0.44, 0.38);
          ctx.quadraticCurveTo(0.58, 0.2, 0.64, -0.04);
        } else {
          ctx.bezierCurveTo(-0.32, 0.84, 0.56, 0.62, 0.64, -0.04);
        }

        // Double beak and rounded head
        ctx.lineTo(0.96, -0.14);
        ctx.quadraticCurveTo(0.79, -0.18, 0.72, -0.23);
        ctx.lineTo(1.04, -0.34);
        ctx.quadraticCurveTo(0.78, -0.32, 0.65, -0.38);
        ctx.bezierCurveTo(0.56, -0.64, 0.18, -0.62, 0.14, -0.22);

        if (up > 0.02) {
          // Upward-swept 3-scalloped wing
          ctx.quadraticCurveTo(-0.38 * up - 0.06, -0.24 * up - 0.06, -0.88 * up - 0.04, -0.92 * up);
          ctx.quadraticCurveTo(-0.84 * up - 0.04, -0.58 * up, -0.62 * up - 0.08, -0.46 * up);
          ctx.quadraticCurveTo(-0.74 * up - 0.06, -0.4 * up, -0.85 * up - 0.05, -0.42 * up);
          ctx.quadraticCurveTo(-0.74 * up - 0.06, -0.18 * up, -0.56 * up - 0.1, -0.12 * up);
          ctx.quadraticCurveTo(-0.66 * up - 0.08, -0.06 * up, -0.74 * up - 0.08, -0.04 * up);
          ctx.quadraticCurveTo(-0.56, 0.14, -0.38, 0.18);
        } else {
          // Sleek back contour while wing beats downward
          ctx.quadraticCurveTo(-0.14, 0.0, -0.38, 0.18);
        }

        ctx.quadraticCurveTo(-0.68, 0.34, -1.05, 0.42);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // Steady state: glowing dot nodes crossfading in as birds settle
      if (p.morph > 0.04) {
        // Soft outer halo (brightens during steady shimmer wave)
        ctx.fillStyle = shimmer > 0.25 ? '#7dd3fc' : p.color;
        ctx.globalAlpha = (0.28 + shimmer * 0.3) * p.morph;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * (2.1 + shimmer * 0.5), 0, Math.PI * 2);
        ctx.fill();

        // Crisp dot core
        ctx.fillStyle = shimmer > 0.45 ? '#ffffff' : p.color;
        ctx.globalAlpha = Math.min(1, (0.94 + shimmer * 0.06) * p.morph);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

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
      }

      drawBrainSynapses(tSec);

      for (let i = 0; i < particles.length; i++) {
        drawParticle(particles[i], tSec);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const loadImage = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

    Promise.all([loadImage('/csa-icon.png'), loadImage('/csa-brain.png'), fontsReady]).then(
      ([iconImg, brainImg]) => {
        if (isCancelled) return;
        loadedIconImg = iconImg;
        loadedBrainImg = brainImg;
        initScene();
        animationFrameId = requestAnimationFrame(animate);
      }
    );

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const newWidth = canvas.parentElement.getBoundingClientRect().width;
      if (Math.abs(newWidth - width) > 2) {
        initScene();
      }
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
      isCancelled = true;
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
