import { ImageResponse } from 'next/og';
// In a real app we'd import the supabase client to fetch the greeting details
// import { supabase } from '@/lib/supabase/client';

export const runtime = 'edge';
export const alt = 'A personalized greeting';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  // ─── Fetch Data (Mocked for now) ───────────────────────────────────────────
  const recipientName = 'Someone Special';
  const headline = 'A beautiful cinematic greeting awaits you.';
  const themeColor = '#a855f7'; // Purple accent default

  // Simulated DB Fetch
  /*
  const { data } = await supabase
    .from('greetings')
    .select('ai_content')
    .eq('slug', slug)
    .single();

  if (data) {
    recipientName = data.ai_content.recipientName;
    headline = data.ai_content.heroHeadline;
    if (data.ai_content.theme.accent === 'blue') themeColor = '#3b82f6';
    if (data.ai_content.theme.accent === 'roseGold') themeColor = '#f43f5e';
  }
  */

  // ─── Generate Image ────────────────────────────────────────────────────────
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b', // zinc-950
          backgroundImage: 'radial-gradient(circle at 50% -20%, #27272a, #09090b)',
          padding: '40px 80px',
        }}
      >
        {/* Glow behind the text */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '300px',
            background: themeColor,
            filter: 'blur(120px)',
            opacity: 0.3,
            borderRadius: '50%',
          }}
        />

        <p
          style={{
            fontSize: 24,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#a1a1aa', // zinc-400
            marginBottom: 20,
          }}
        >
          A Celebration For
        </p>

        <h1
          style={{
            fontSize: 100,
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.1,
            margin: '0 0 40px 0',
          }}
        >
          {recipientName}
        </h1>

        <p
          style={{
            fontSize: 32,
            color: '#d4d4d8', // zinc-300
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {headline}
        </p>

        {/* Footer logo/brand */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <p
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
              letterSpacing: '0.1em',
            }}
          >
            GS GREETINGS AI
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
