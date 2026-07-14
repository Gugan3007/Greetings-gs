'use client';

/**
 * GPU-light particle atmosphere. This replaces the previous always-running
 * WebGL scene, avoiding a large Three.js render loop on Safari while keeping
 * the same subtle depth and motion.
 */
export function ParticleField() {
  return (
    <div className="particle-field pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="particle-field__layer particle-field__layer--far" />
      <div className="particle-field__layer particle-field__layer--near" />
    </div>
  );
}
