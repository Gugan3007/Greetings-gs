'use client';

import { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { lerp } from '@/lib/utils';

const PARTICLE_COUNT = 200;

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const mouse = useMousePosition();
  const prefersReduced = useReducedMotion();
  const targetRotation = useRef({ x: 0, y: 0 });

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const siz = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Distribute in a sphere
      const radius = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      siz[i] = 0.5 + Math.random() * 2;
    }

    return [pos, siz];
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Subtle mouse-follow rotation
    if (!prefersReduced) {
      targetRotation.current.x = (mouse.ny - 0.5) * 0.3;
      targetRotation.current.y = (mouse.nx - 0.5) * 0.3;
    }

    meshRef.current.rotation.x = lerp(
      meshRef.current.rotation.x,
      targetRotation.current.x,
      delta * 0.5
    );
    meshRef.current.rotation.y = lerp(
      meshRef.current.rotation.y,
      targetRotation.current.y,
      delta * 0.5
    );

    // Slow constant rotation
    meshRef.current.rotation.z += delta * 0.02;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, sizes]);

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color="#a855f7"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * R3F particle field background — floating particles that react subtly to mouse.
 * Lazy-loaded via next/dynamic with ssr: false.
 */
export function ParticleField() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'low-power',
        }}
        style={{ background: 'transparent' }}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
