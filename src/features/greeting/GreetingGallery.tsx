'use client';

import { type GreetingContent } from '@/lib/ai/schema';
import { Reveal } from '@/components/motion/Reveal';

interface GreetingGalleryProps {
  data: GreetingContent;
}

export function GreetingGallery({ data }: GreetingGalleryProps) {
  const photos = data.gallery || [];

  if (photos.length === 0) return null;

  return (
    <section className="greeting-section py-20 sm:py-32">
      <Reveal direction="up">
        <h2 
          className="mb-16 text-center text-4xl font-bold sm:text-5xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Moments Captured
        </h2>
      </Reveal>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {photos.map((photo, idx) => (
          <Reveal 
            key={idx} 
            blur={10} 
            direction="up"
            delay={idx * 0.05} 
            className="min-w-0"
          >
            <div className={`group relative overflow-hidden rounded-[1.5rem] border border-glass-border ${idx % 5 === 0 ? 'sm:row-span-2' : ''}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.caption || `Memory ${idx + 1}`}
                className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${idx % 5 === 0 ? 'aspect-[4/5] sm:h-full' : 'aspect-[4/3]'}`}
                loading="lazy"
              />
              
              {/* Optional Caption Overlay */}
              {photo.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-sm font-medium text-white shadow-sm">
                    {photo.caption}
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
