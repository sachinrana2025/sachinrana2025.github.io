import { ImageResponse } from 'next/og';

// Social preview image, exported as a real /og.png file. GitHub Pages serves files by
// extension, so an extensionless metadata route would reach crawlers with the wrong type.
export const dynamic = 'force-static';

const size = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#f8fafc',
          color: '#0f172a',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 4, color: '#475569', fontFamily: 'monospace' }}>
          AGENTIC AI · INFRASTRUCTURE · IIoT
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, lineHeight: 1.04 }}>AI agents that</div>
          <div style={{ fontSize: 84, lineHeight: 1.04, color: '#6d28d9', fontStyle: 'italic' }}>solve real problems.</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px solid #e2e8f0', paddingTop: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 40 }}>Sachin Rana</div>
            <div style={{ fontSize: 24, color: '#475569', fontFamily: 'sans-serif', marginTop: 6 }}>
              Agentic AI Architect · Fractional CTO
            </div>
          </div>
          <div style={{ fontSize: 24, color: '#475569', fontFamily: 'sans-serif' }}>sachinrana2025.github.io</div>
        </div>
      </div>
    ),
    size,
  );
}
