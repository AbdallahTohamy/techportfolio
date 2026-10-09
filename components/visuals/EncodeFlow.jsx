'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, usePrefersReducedMotion } from '@/lib/hooks';

const INPUTS = ['.mov', '.wav', '.mkv'];
const OUTPUTS = ['h264 · 720p', 'hls · adaptive', 'aac · 128k', 'thumbs · webp'];
const IN_Y = [60, 120, 180];
const OUT_Y = [45, 95, 145, 195];

export default function EncodeFlow() {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView();
  const svg = useRef(null);
  const [count, setCount] = useState(9820);

  useEffect(() => {
    const s = svg.current;
    if (s && s.pauseAnimations) inView && !reduced ? s.unpauseAnimations() : s.pauseAnimations();
    if (!inView || reduced) return;
    const id = setInterval(() => setCount((c) => (c >= 10000 ? 9820 : c + 4)), 140);
    return () => clearInterval(id);
  }, [inView, reduced]);

  return (
    <div ref={ref} className="viz-encode">
      <svg ref={svg} viewBox="0 0 400 240" className="viz-svg" aria-hidden>
        {IN_Y.map((y, i) => (
          <path key={`i${i}`} id={`enc-in-${i}`} d={`M78 ${y} C 130 ${y}, 140 120, 168 120`} className="viz-encode-wire" />
        ))}
        {OUT_Y.map((y, i) => (
          <path key={`o${i}`} id={`enc-out-${i}`} d={`M232 120 C 262 120, 262 ${y}, 290 ${y}`} className="viz-encode-wire" />
        ))}
        {!reduced &&
          IN_Y.map((_, i) => (
            <rect key={`pi${i}`} width="8" height="6" x="-4" y="-3" rx="1.5" className="viz-encode-pkt in">
              <animateMotion dur="2.2s" repeatCount="indefinite" begin={`-${i * 0.7}s`}>
                <mpath href={`#enc-in-${i}`} />
              </animateMotion>
            </rect>
          ))}
        {!reduced &&
          OUT_Y.map((_, i) => (
            <circle key={`po${i}`} r="2.6" className="viz-encode-pkt out">
              <animateMotion dur="1.8s" repeatCount="indefinite" begin={`-${0.4 + i * 0.45}s`}>
                <mpath href={`#enc-out-${i}`} />
              </animateMotion>
            </circle>
          ))}

        {INPUTS.map((t, i) => (
          <g key={t} transform={`translate(18 ${IN_Y[i] - 13})`} className="viz-encode-file">
            <path d="M0 0 h44 l10 10 v16 h-54 z" />
            <text x="24" y="17" textAnchor="middle">{t}</text>
          </g>
        ))}

        <g className="viz-encode-core">
          <rect x="168" y="96" width="64" height="48" rx="10" />
          <text x="200" y="118" textAnchor="middle">ffmpeg</text>
          <text x="200" y="133" textAnchor="middle" className="sub">batch</text>
        </g>

        {OUTPUTS.map((t, i) => (
          <g key={t} transform={`translate(292 ${OUT_Y[i] - 10})`} className="viz-encode-out">
            <rect width="100" height="20" rx="10" />
            <text x="50" y="13.5" textAnchor="middle">{t}</text>
          </g>
        ))}

        <text x="18" y="228" className="viz-encode-count">
          processed {count.toLocaleString('en-US')} / 10,000+
        </text>
      </svg>
    </div>
  );
}
