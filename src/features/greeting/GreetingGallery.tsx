'use client';

import { type GreetingContent } from '@/lib/ai/schema';
import { Reveal } from '@/components/motion/Reveal';

interface GreetingGalleryProps {
  data: GreetingContent;
}

export function GreetingGallery({ data }: GreetingGalleryProps) {
  const photos = data.gallery || [];
  const isSinglePhoto = photos.length === 1;
  const galleryLayout = isSinglePhoto
    ? 'flex justify-center'
    : photos.length === 2
      ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-4xl'
      : 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 max-w-5xl';

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

      <div className={`mx-auto ${galleryLayout}`}>
        {photos.map((photo, idx) => (
          <Reveal 
            key={idx} 
            blur={10} 
            direction="up"
            delay={idx * 0.05} 
            className={isSinglePhoto ? 'w-full max-w-2xl' : 'min-w-0'}
          >
            <div className={`memory-photo-frame group relative rounded-[1.75rem] p-[1px] ${!isSinglePhoto && idx % 5 === 0 ? 'sm:row-span-2' : ''}`}>
              <div className="relative overflow-hidden rounded-[calc(1.75rem-1px)] bg-[#08080b] p-2 sm:p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption || `Memory ${idx + 1}`}
                  className={`w-full rounded-[1.25rem] transition-transform duration-700 ease-out group-hover:scale-[1.015] ${
                    isSinglePhoto
                      ? 'max-h-[72svh] object-contain'
                      : idx % 5 === 0
                        ? 'aspect-[4/5] object-cover sm:h-full'
                        : 'aspect-[4/3] object-cover'
                  }`}
                  loading="lazy"
                />
              
                {photo.caption && (
                  <div className="absolute inset-x-3 bottom-3 rounded-b-[1.25rem] bg-gradient-to-t from-black/85 via-black/30 to-transparent px-5 pb-5 pt-12 text-center opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                    <p className="text-sm font-medium text-white shadow-sm">{photo.caption}</p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
