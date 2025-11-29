import React, { forwardRef } from 'react';

export const ExecutiveOnePager = forwardRef(({ data }: { data: any }, ref: any) => {
  if (!data) return null;

  return (
    <div ref={ref} style={{
        position: 'fixed', top: '-9999px', left: '-9999px',
        width: '297mm', height: '210mm', // Landscape A4 (Presentation Style)
        display: 'grid', gridTemplateColumns: '30% 70%',
        fontFamily: 'Helvetica, Arial, sans-serif'
    }}>
      
      {/* SIDEBAR (Dark Blue) */}
      <div style={{ backgroundColor: '#0f172a', color: 'white', padding: '40px', display: 'flex', flexDirection: 'column' }}>
          
          {/* PROFILE IMAGE PLACEHOLDER (or actual image if we passed it) */}
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#3b82f6', marginBottom: '30px', overflow: 'hidden', border: '3px solid white' }}>
             <img src="/profile.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <h1 style={{ fontSize: '24pt', fontWeight: 'bold', margin: '0 0 10px 0', lineHeight: '1.1' }}>{data.fullName}</h1>
          <h2 style={{ fontSize: '14pt', color: '#94a3b8', margin: '0 0 40px 0', fontWeight: 'normal' }}>{data.title}</h2>

          <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '10pt', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '15px' }}>Contact</h3>
              <p style={{ fontSize: '10pt', marginBottom: '8px' }}>{data.contact}</p>
              <p style={{ fontSize: '10pt', color: '#94a3b8' }}>Generated: {new Date().toLocaleDateString()}</p>
          </div>

          <div>
              <h3 style={{ fontSize: '10pt', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '2px', borderBottom: '1px solid #1e293b', paddingBottom: '10px', marginBottom: '15px' }}>Core Competencies</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {data.skills.map((s: string, i: number) => (
                      <span key={i} style={{ fontSize: '9pt', background: 'rgba(255,255,255,0.1)', padding: '5px 10px', borderRadius: '4px' }}>{s}</span>
                  ))}
              </div>
          </div>
      </div>

      {/* MAIN CONTENT (White) */}
      <div style={{ backgroundColor: 'white', padding: '50px', color: '#334155' }}>
          
          {/* HEADER / STRATEGY HOOK */}
          <div style={{ marginBottom: '40px', background: '#f8fafc', padding: '20px', borderLeft: '4px solid #3b82f6' }}>
             <h3 style={{ fontSize: '12pt', fontWeight: 'bold', color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase' }}>Executive Synthesis</h3>
             <p style={{ fontSize: '11pt', lineHeight: '1.6', margin: 0 }}>{data.summary}</p>
          </div>

          {/* EXPERIENCE */}
          <div>
              <h3 style={{ fontSize: '14pt', fontWeight: 'bold', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '25px' }}>Selected Experience</h3>
              
              {data.experience.slice(0, 3).map((exp: any, i: number) => (
                  <div key={i} style={{ marginBottom: '25px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                          <span style={{ fontSize: '12pt', fontWeight: 'bold', color: '#1e293b' }}>{exp.title}</span>
                          <span style={{ fontSize: '10pt', color: '#64748b', fontWeight: 'bold' }}>{exp.company}</span>
                      </div>
                      <div style={{ fontSize: '9pt', color: '#94a3b8', marginBottom: '8px', fontStyle: 'italic' }}>{exp.date}</div>
                      <ul style={{ margin: 0, paddingLeft: '18px' }}>
                          {exp.bullets.map((b: string, j: number) => (
                              <li key={j} style={{ fontSize: '10pt', marginBottom: '4px', lineHeight: '1.4' }}>{b}</li>
                          ))}
                      </ul>
                  </div>
              ))}
          </div>

      </div>
    </div>
  );
});

ExecutiveOnePager.displayName = "ExecutiveOnePager";
