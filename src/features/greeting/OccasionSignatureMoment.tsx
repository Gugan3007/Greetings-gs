'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sparkles } from '@react-three/drei';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useMemo, useRef, useState, type ReactElement } from 'react';
import type { Group } from 'three';
import type { GreetingContent, GreetingSignatureMoment } from '@/lib/ai/schema';

type VisualFamily = NonNullable<GreetingSignatureMoment>['visualFamily'];

type VisualProps = {
  progress: number;
  reducedMotion: boolean;
  accent: string;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeOut = (value: number) => 1 - Math.pow(1 - clamp(value), 3);
const easeInOut = (value: number) => {
  const p = clamp(value);
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
};

const DEFAULT_MOMENT: GreetingSignatureMoment = {
  key: 'just-because',
  visualFamily: 'aurora',
  occasionLabel: 'Just Because',
  wish: 'No reason needed — this little world was made with care.',
};

function splitWish(wish: string) {
  return wish.split(' ').filter(Boolean);
}

function RingModel({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const settled = reducedMotion ? 1 : easeOut((progress - 0.12) / 0.58);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const shimmer = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 1.2) * 0.08;
    group.current.rotation.y = settled * Math.PI * 1.12 + shimmer;
    group.current.rotation.x = -0.34 + settled * 0.14;
    group.current.position.y = -1.1 + settled * 1.1;
    group.current.scale.setScalar(0.58 + settled * 0.42);
  });

  return (
    <group ref={group}>
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.105, 32, 128]} />
        <meshStandardMaterial color="#d9d7d2" metalness={1} roughness={0.16} envMapIntensity={1.4} />
      </mesh>
      <mesh castShadow position={[0, 1.06, 0]} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.36, 2]} />
        <meshPhysicalMaterial color="#eef8ff" roughness={0.05} transmission={0.3} thickness={0.7} metalness={0} clearcoat={1} clearcoatRoughness={0.03} />
      </mesh>
      <mesh castShadow position={[-0.34, 0.9, 0]}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial color="#e8caa6" metalness={1} roughness={0.22} />
      </mesh>
      <mesh castShadow position={[0.34, 0.9, 0]}>
        <sphereGeometry args={[0.065, 16, 16]} />
        <meshStandardMaterial color="#e8caa6" metalness={1} roughness={0.22} />
      </mesh>
    </group>
  );
}

function CapModel({ progress, reducedMotion, briefcase = false }: { progress: number; reducedMotion: boolean; briefcase?: boolean }) {
  const group = useRef<Group>(null);
  const settled = reducedMotion ? 1 : easeInOut(progress);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const arc = Math.sin(settled * Math.PI) * 1.8;
    group.current.position.x = -2.4 + settled * 4.8;
    group.current.position.y = -1.8 + settled * 3.2 + arc;
    group.current.rotation.z = briefcase ? -0.15 + settled * 0.3 : -0.7 + settled * 1.35;
    group.current.rotation.y = briefcase ? 0.25 : settled * Math.PI * 1.2;
    if (!reducedMotion) group.current.rotation.x = Math.sin(clock.elapsedTime * 2 + settled * 4) * 0.08;
  });

  if (briefcase) {
    return (
      <group ref={group} scale={0.72}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.65, 1.05, 0.42]} />
          <meshStandardMaterial color="#5b361f" metalness={0.15} roughness={0.42} />
        </mesh>
        <mesh castShadow position={[0, 0.64, 0]}>
          <torusGeometry args={[0.42, 0.045, 12, 48, Math.PI]} />
          <meshStandardMaterial color="#c9a15b" metalness={0.8} roughness={0.24} />
        </mesh>
        <mesh castShadow position={[0, 0.04, 0.24]}>
          <boxGeometry args={[0.22, 0.18, 0.06]} />
          <meshStandardMaterial color="#f0c86a" metalness={0.9} roughness={0.18} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={group} scale={0.78}>
      <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1.72, 1.72, 0.12]} />
        <meshStandardMaterial color="#111827" metalness={0.18} roughness={0.34} />
      </mesh>
      <mesh castShadow position={[0, -0.28, 0]}>
        <boxGeometry args={[0.95, 0.36, 0.34]} />
        <meshStandardMaterial color="#1f2937" metalness={0.08} roughness={0.38} />
      </mesh>
      <mesh castShadow position={[0.55, -0.04, 0.1]} rotation={[0, 0, -0.35]}>
        <cylinderGeometry args={[0.025, 0.025, 0.95, 12]} />
        <meshStandardMaterial color="#f5c85c" metalness={0.25} roughness={0.28} />
      </mesh>
      <mesh castShadow position={[0.82, -0.48, 0.1]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#f5c85c" metalness={0.25} roughness={0.25} />
      </mesh>
    </group>
  );
}

function ThreeStage({ progress, reducedMotion, family }: VisualProps & { family: Extract<VisualFamily, 'ring' | 'cap' | 'briefcase'> }) {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0.2, 5.2], fov: 42 }} shadows dpr={[1, 1.25]} performance={{ min: 0.55 }}>
        <ambientLight intensity={0.65} />
        <spotLight position={[2.8, 4, 3]} angle={0.4} penumbra={0.8} intensity={2.6} castShadow />
        <pointLight position={[-3, 1.8, 2]} intensity={1.1} color="#8fb7ff" />
        <Environment preset="studio" />
        <Float speed={reducedMotion ? 0 : 1.35} rotationIntensity={family === 'ring' ? 0.28 : 0.15} floatIntensity={family === 'ring' ? 0.26 : 0.14}>
          {family === 'ring' ? <RingModel progress={progress} reducedMotion={reducedMotion} /> : <CapModel progress={progress} reducedMotion={reducedMotion} briefcase={family === 'briefcase'} />}
        </Float>
        <Sparkles count={family === 'ring' ? 42 : 26} scale={4} size={family === 'ring' ? 2.4 : 1.4} speed={reducedMotion ? 0 : 0.35} color={family === 'ring' ? '#fff7d6' : '#8fb7ff'} />
      </Canvas>
    </div>
  );
}

function BirthdayBalloons({ progress, reducedMotion }: VisualProps) {
  const balloons = useMemo(
    () => Array.from({ length: 18 }, (_, index) => ({
      left: (index * 23) % 100,
      size: 42 + (index % 6) * 13,
      depth: 0.55 + (index % 5) * 0.12,
      hue: [262, 210, 332, 38, 176, 288][index % 6],
      delay: (index % 7) * 0.035,
      tilt: -12 + (index % 7) * 4,
    })),
    []
  );
  const confetti = useMemo(() => Array.from({ length: 24 }, (_, index) => ({
    left: 12 + ((index * 19) % 76),
    top: 42 + ((index * 13) % 24),
    hue: [45, 210, 320, 145, 275][index % 5],
    rot: (index * 37) % 180,
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_72%,rgba(124,58,237,0.24),transparent_40%)]" />
      {balloons.map((balloon, index) => {
        const travel = reducedMotion ? 0.64 : clamp((progress - balloon.delay) / 0.78);
        const y = 108 - travel * (132 + balloon.depth * 28);
        const sway = reducedMotion ? 0 : Math.sin(progress * 8 + index) * 14 * balloon.depth;
        const pulse = reducedMotion ? 1 : 1 + Math.sin(progress * 12 + index) * 0.025;
        return (
          <div
            key={index}
            className="absolute"
            style={{
              left: `${balloon.left}%`,
              top: 0,
              transform: `translate3d(${sway}px, ${y}svh, 0) rotate(${balloon.tilt}deg) scale(${pulse * balloon.depth})`,
              filter: balloon.depth < 0.8 ? 'blur(1.4px)' : undefined,
              opacity: 0.34 + balloon.depth * 0.62,
              willChange: reducedMotion ? undefined : 'transform, opacity',
            }}
          >
            <div
              className="relative rounded-full shadow-[0_24px_55px_rgba(0,0,0,0.35)]"
              style={{
                width: balloon.size,
                height: balloon.size * 1.22,
                background: `radial-gradient(circle at 30% 24%, rgba(255,255,255,0.82), transparent 13%), radial-gradient(circle at 62% 72%, hsl(${balloon.hue} 88% 43%), hsl(${balloon.hue} 86% 58%) 54%, hsl(${balloon.hue} 80% 32%))`,
              }}
            >
              <span className="absolute -bottom-16 left-1/2 h-16 w-px origin-top -translate-x-1/2 bg-white/35" />
            </div>
          </div>
        );
      })}
      {confetti.map((piece, index) => {
        const burst = reducedMotion ? 1 : easeOut((progress - 0.72) / 0.24);
        return (
          <span
            key={index}
            className="absolute h-1.5 w-4 rounded-full"
            style={{
              left: `${piece.left}%`,
              top: `${piece.top - burst * (10 + (index % 7) * 5)}%`,
              transform: `translateZ(0) rotate(${piece.rot + burst * 220}deg) scale(${burst})`,
              background: `hsl(${piece.hue} 90% 64%)`,
              opacity: burst,
              willChange: reducedMotion ? undefined : 'transform, opacity',
            }}
          />
        );
      })}
    </div>
  );
}

function BouquetBloom({ progress, reducedMotion }: VisualProps) {
  const petals = useMemo(() => Array.from({ length: 18 }, (_, index) => ({
    x: 42 + (index % 6) * 4.7,
    y: 48 - Math.floor(index / 6) * 8,
    hue: [340, 25, 52, 312, 8, 145][index % 6],
    delay: index * 0.025,
  })), []);
  const draw = reducedMotion ? 1 : easeOut(progress / 0.38);

  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <filter id="bouquetGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d="M50 82 C45 67 39 57 31 45" stroke="#97b88a" strokeWidth="0.8" fill="none" strokeDasharray="44" strokeDashoffset={44 - draw * 44} />
      <path d="M50 82 C51 64 52 55 52 38" stroke="#a8c99a" strokeWidth="0.9" fill="none" strokeDasharray="48" strokeDashoffset={48 - draw * 48} />
      <path d="M50 82 C58 66 64 58 72 45" stroke="#8faa7d" strokeWidth="0.8" fill="none" strokeDasharray="46" strokeDashoffset={46 - draw * 46} />
      <path d="M42 82 L58 82 L54 94 L46 94 Z" fill="rgba(245, 226, 196, 0.78)" stroke="rgba(255,255,255,0.25)" />
      {petals.map((petal, index) => {
        const bloom = reducedMotion ? 1 : easeOut((progress - 0.24 - petal.delay) / 0.28);
        return (
          <g key={index} transform={`translate(${petal.x} ${petal.y}) scale(${bloom})`} opacity={bloom} filter="url(#bouquetGlow)">
            <ellipse rx="2.7" ry="5.5" fill={`hsl(${petal.hue} 75% 72%)`} transform={`rotate(${index * 52})`} />
            <ellipse rx="2.4" ry="5.1" fill={`hsl(${petal.hue} 82% 62%)`} transform={`rotate(${index * 52 + 74})`} />
            <circle r="1.2" fill="#ffe7a3" />
          </g>
        );
      })}
      {Array.from({ length: 20 }).map((_, index) => (
        <circle
          key={index}
          cx={20 + ((index * 17) % 60)}
          cy={70 - easeOut(progress) * (22 + (index % 5) * 7)}
          r={0.25 + (index % 3) * 0.16}
          fill="#fff6d7"
          opacity={reducedMotion ? 0.45 : 0.15 + progress * 0.55}
        />
      ))}
    </svg>
  );
}

function AirplaneDrift({ progress, reducedMotion }: VisualProps) {
  const p = reducedMotion ? 0.72 : easeInOut(progress);
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_28%_76%,rgba(251,146,60,0.20),transparent_35%),linear-gradient(135deg,rgba(21,30,52,0.55),rgba(90,54,119,0.12),rgba(251,146,60,0.10))]">
      <div
        className="absolute h-48 w-48 rounded-full bg-orange-200/20 blur-3xl"
        style={{ left: `${12 + p * 55}%`, top: `${66 - p * 46}%` }}
      />
      <svg className="absolute h-44 w-44 drop-shadow-[0_26px_45px_rgba(0,0,0,0.45)]" style={{ left: `${-8 + p * 86}%`, top: `${70 - p * 58}%`, transform: `rotate(${-22 + p * 18}deg)` }} viewBox="0 0 120 120" aria-hidden="true">
        <path d="M8 62 L110 16 L82 104 L58 73 L36 94 L43 68 Z" fill="url(#plane)" stroke="rgba(255,255,255,0.45)" />
        <path d="M43 68 L110 16 L58 73" fill="none" stroke="rgba(255,255,255,0.42)" />
        <defs>
          <linearGradient id="plane" x1="10" x2="110" y1="20" y2="100">
            <stop stopColor="#fff7ed" />
            <stop offset="0.55" stopColor="#f5d0a9" />
            <stop offset="1" stopColor="#c084fc" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute h-px w-[45vw] origin-right bg-gradient-to-l from-white/40 to-transparent" style={{ left: `${-14 + p * 70}%`, top: `${78 - p * 50}%`, transform: 'rotate(-28deg)' }} />
    </div>
  );
}

function FireworksBurst({ progress, reducedMotion }: VisualProps) {
  const particles = useMemo(() => Array.from({ length: 72 }, (_, index) => ({
    angle: (index / 72) * Math.PI * 2,
    radius: 8 + (index % 9) * 5,
    hue: [45, 285, 212, 333, 138][index % 5],
    wave: index % 3,
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/20 blur-3xl" />
      {particles.map((particle, index) => {
        const burst = reducedMotion ? 1 : easeOut((progress - 0.16 * particle.wave) / 0.42);
        return (
          <span
            key={index}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full shadow-[0_0_18px_currentColor]"
            style={{
              color: `hsl(${particle.hue} 90% 66%)`,
              transform: `translate(${Math.cos(particle.angle) * particle.radius * burst}px, ${Math.sin(particle.angle) * particle.radius * burst}px) scale(${1 - burst * 0.25})`,
              opacity: burst > 0.03 ? 1 - burst * 0.18 : 0,
            }}
          />
        );
      })}
      <svg className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_18px_45px_rgba(252,211,77,0.35)]" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 7 L61 36 L92 37 L67 56 L76 88 L50 69 L24 88 L33 56 L8 37 L39 36 Z" fill="url(#starGold)" />
        <defs>
          <linearGradient id="starGold" x1="18" x2="82" y1="7" y2="90">
            <stop stopColor="#fff7bc" />
            <stop offset="0.45" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function AuroraField({ progress, reducedMotion }: VisualProps) {
  const orbs = useMemo(() => Array.from({ length: 16 }, (_, index) => ({
    left: (index * 29) % 100,
    top: 20 + ((index * 17) % 58),
    size: 18 + (index % 5) * 10,
  })), []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-x-[-12%] top-[18%] h-[48%] rounded-[50%] blur-3xl"
        style={{
          transform: `translateY(${(reducedMotion ? 0 : progress - 0.5) * 32}px) rotate(${progress * 8}deg)`,
          background: 'linear-gradient(90deg, rgba(56,189,248,.12), rgba(168,85,247,.28), rgba(244,114,182,.18), rgba(34,197,94,.10))',
        }}
      />
      {orbs.map((orb, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-white/35 blur-[1px]"
          style={{
            left: `${orb.left}%`,
            top: `${orb.top + (reducedMotion ? 0 : Math.sin(progress * 6 + index) * 5)}%`,
            width: orb.size,
            height: orb.size,
            opacity: 0.08 + (index % 4) * 0.04,
          }}
        />
      ))}
    </div>
  );
}

function DoorwayReveal({ progress, reducedMotion }: VisualProps) {
  const p = reducedMotion ? 1 : easeOut(progress);
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_50%_72%,rgba(251,191,36,0.20),transparent_38%)]">
      <div className="absolute left-1/2 top-1/2 h-[46vh] w-[28vh] -translate-x-1/2 -translate-y-1/2 rounded-t-[999px] border border-white/20 bg-black/35 shadow-[0_0_90px_rgba(251,191,36,0.18)]" />
      <div
        className="absolute left-1/2 top-1/2 h-[40vh] w-[22vh] -translate-x-1/2 -translate-y-1/2 rounded-t-[999px] bg-gradient-to-b from-amber-200/65 via-orange-300/28 to-transparent blur-sm"
        style={{ clipPath: `inset(${100 - p * 100}% 0 0 0)`, opacity: 0.35 + p * 0.55 }}
      />
      <svg className="absolute left-[56%] top-[52%] h-24 w-24 drop-shadow-[0_20px_45px_rgba(251,191,36,0.28)]" viewBox="0 0 100 100" aria-hidden="true" style={{ transform: `translateY(${(1 - p) * 60}px) rotate(${(1 - p) * -18}deg)`, opacity: p }}>
        <circle cx="32" cy="44" r="13" fill="none" stroke="#fde68a" strokeWidth="7" />
        <path d="M43 55 L82 76 M62 66 L67 58 M70 70 L76 62" stroke="#fde68a" strokeWidth="7" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const VISUAL_RENDERERS: Record<VisualFamily, (props: VisualProps) => ReactElement> = {
  balloons: (props) => <BirthdayBalloons {...props} />,
  ring: (props) => <ThreeStage {...props} family="ring" />,
  cap: (props) => <ThreeStage {...props} family="cap" />,
  bouquet: (props) => <BouquetBloom {...props} />,
  airplane: (props) => <AirplaneDrift {...props} />,
  fireworks: (props) => <FireworksBurst {...props} />,
  aurora: (props) => <AuroraField {...props} />,
  doorway: (props) => <DoorwayReveal {...props} />,
  briefcase: (props) => <ThreeStage {...props} family="briefcase" />,
};

export function OccasionSignatureMoment({ data }: { data: GreetingContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const lastProgressRef = useRef(0);
  const reducedMotionPreference = useReducedMotion();
  const reducedMotion = Boolean(reducedMotionPreference);
  const moment = data.signatureMoment || DEFAULT_MOMENT;
  const Visual = VISUAL_RENDERERS[moment.visualFamily] || VISUAL_RENDERERS.aurora;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const [progress, setProgress] = useState(reducedMotion ? 1 : 0);
  const textOpacity = useTransform(scrollYProgress, [0.06, 0.24, 0.9], [0, 1, 1]);
  const textY = useTransform(scrollYProgress, [0.06, 0.34], [28, 0]);
  const handoffScale = useTransform(scrollYProgress, [0.82, 1], [1, 0.94]);
  const handoffOpacity = useTransform(scrollYProgress, [0.88, 1], [1, 0.12]);
  const words = useMemo(() => splitWish(moment.wish), [moment.wish]);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (reducedMotion) return;
    if (Math.abs(value - lastProgressRef.current) < 0.012 && value > 0.02 && value < 0.98) return;
    lastProgressRef.current = value;
    setProgress(value);
  });

  return (
    <section ref={sectionRef} className="relative h-[220svh]" aria-label={`${moment.occasionLabel} signature animation`}>
      <motion.div
        className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-6 py-16"
        style={{ scale: reducedMotion ? 1 : handoffScale, opacity: reducedMotion ? 1 : handoffOpacity }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.055),transparent_34%)]" />
        <Visual progress={progress} reducedMotion={reducedMotion} accent="var(--greeting-accent)" />
        <motion.div
          className="relative z-10 mx-auto mt-24 flex max-w-5xl flex-col items-center text-center sm:mt-0"
          style={{ opacity: reducedMotion ? 1 : textOpacity, y: reducedMotion ? 0 : textY }}
        >
          <p className="mb-5 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-white/55 backdrop-blur-xl">
            {moment.occasionLabel} moment
          </p>
          <h2 className="max-w-4xl font-display text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-6xl md:text-7xl">
            {words.map((word, index) => {
              const reveal = reducedMotion ? 1 : easeOut((progress - 0.08 - index * 0.026) / 0.18);
              return (
                <span
                  key={`${word}-${index}`}
                  className="inline-block pr-[0.24em]"
                  style={{
                    opacity: reveal,
                    transform: `translateY(${(1 - reveal) * 34}px) scale(${0.94 + reveal * 0.06})`,
                    background: 'linear-gradient(100deg, #fff, #fde68a 42%, #c4b5fd 78%, #fff)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    textShadow: reveal > 0.95 ? '0 18px 60px rgba(255,255,255,0.16)' : undefined,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </h2>
          <p className="mt-7 max-w-2xl text-sm uppercase tracking-[0.24em] text-white/45 sm:text-base">
            a crafted scroll reveal for this exact occasion
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
