import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    const name = searchParams.get('name') || 'Builder';
    const title = searchParams.get('title') || 'Goa Vibe Coder 🌴';
    const format = searchParams.get('format') || 'A';
    const badgeId = searchParams.get('badgeId') || 'HHGOA-2026';

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
            backgroundColor: '#0B5A36',
            border: '8px solid #FFDF00',
            color: '#FFFDF0',
            fontFamily: 'sans-serif',
            position: 'relative',
            padding: '40px',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFDF00',
                color: '#121814',
                padding: '8px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '20px',
              }}
            >
              2:47PM STUDIO
            </div>
            <div
              style={{
                fontSize: '44px',
                fontWeight: '900',
                color: '#FFDF00',
              }}
            >
              HACKER HOUSE GOA 2026
            </div>
            <div
              style={{
                backgroundColor: '#FF007A',
                color: '#FFFFFF',
                padding: '8px 20px',
                borderRadius: '20px',
                fontWeight: 'bold',
                fontSize: '20px',
              }}
            >
              #FrameInGoa
            </div>
          </div>

          {/* Body Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0D2419',
              border: '4px solid #FF007A',
              borderRadius: '24px',
              padding: '35px 55px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '22px', color: '#FFDF00', fontWeight: 'bold', marginBottom: '10px' }}>
              {format === 'A' ? 'OFFICIAL PFP OVERLAY' : `BUILDER BADGE • ${badgeId}`}
            </div>
            <div style={{ fontSize: '52px', fontWeight: '900', color: '#FFFDF0', marginBottom: '15px' }}>
              {name.toUpperCase()}
            </div>
            <div
              style={{
                backgroundColor: '#FF007A',
                color: '#FFFFFF',
                padding: '10px 28px',
                borderRadius: '12px',
                fontSize: '26px',
                fontWeight: 'bold',
              }}
            >
              ROLE: {title.toUpperCase()}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: '25px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#FFDF00',
            }}
          >
            <span>GOA, INDIA</span>
            <span>•</span>
            <span>28 - 31 OCT 2026</span>
            <span>•</span>
            <span style={{ color: '#FF007A' }}>GENERATE YOURS AT HHGOA.COM</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response(`Failed to generate OG image`, {
      status: 500,
    });
  }
}
