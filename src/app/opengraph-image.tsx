import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const alt = 'URUN - Sistem Operasi Mikro-Komunitas Berdaulat';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #09090b, #052e16)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            width: '120px',
            height: '120px',
            background: 'linear-gradient(45deg, #059669, #34d399)',
            borderRadius: '28px',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '72px',
            fontWeight: 'bolder',
            color: '#09090b',
            boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)'
          }}>
            U
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '80px', fontWeight: 'bold', margin: '0 0 20px 0', letterSpacing: '-0.02em', color: '#fff' }}>
            URUN
          </h1>
          <p style={{ fontSize: '36px', fontWeight: '600', margin: '0', color: '#34d399' }}>
            Sistem Operasi Mikro-Komunitas Berdaulat
          </p>
          <p style={{ fontSize: '24px', color: '#a1a1aa', marginTop: '24px', maxWidth: '800px', lineHeight: 1.4 }}>
            Transparansi Kas Mutlak • Kedaulatan Data Terisolasi • Kolaborasi Tingkat RT/RW
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
