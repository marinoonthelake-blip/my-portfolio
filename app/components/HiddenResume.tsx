import React, { forwardRef } from 'react';

export const HiddenResume = forwardRef(({ data }: { data: any }, ref: any) => {
  if (!data) return null;

  return (
    <div ref={ref} style={{
        position: 'fixed', top: '-9999px', left: '-9999px',
        width: '210mm', minHeight: '297mm', // A4 Size
        background: 'white', color: 'black', padding: '15mm',
        fontFamily: 'Helvetica, Arial, sans-serif'
    }}>
      {/* HEADER */}
      <div style={{ borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28pt', fontWeight: 'bold', margin: 0, letterSpacing: '-1px' }}>{data.fullName.toUpperCase()}</h1>
          <h2 style={{ fontSize: '14pt', color: '#666', marginTop: '5px', fontWeight: 'normal' }}>{data.title}</h2>
          <div style={{ fontSize: '10pt', color: '#444', marginTop: '10px', display: 'flex', gap: '15px' }}>
              <span>{data.contact}</span>
              <span>•</span>
              <span>Generated: {new Date().toLocaleDateString()}</span>
          </div>
      </div>

      {/* SUMMARY */}
      <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px' }}>EXECUTIVE SYNTHESIS</h3>
          <p style={{ fontSize: '10pt', lineHeight: '1.5' }}>{data.summary}</p>
      </div>

      {/* SKILLS */}
      <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px' }}>CORE COMPETENCIES</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {data.skills.map((s: string, i: number) => (
                  <span key={i} style={{ fontSize: '9pt', background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>{s}</span>
              ))}
          </div>
      </div>

      {/* EXPERIENCE */}
      <div>
          <h3 style={{ fontSize: '12pt', fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '10px' }}>RELEVANT EXPERIENCE</h3>
          {data.experience.map((exp: any, i: number) => (
              <div key={i} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '11pt' }}>{exp.title}</span>
                      <span style={{ fontSize: '10pt', color: '#666' }}>{exp.date}</span>
                  </div>
                  <div style={{ fontStyle: 'italic', fontSize: '10pt', marginBottom: '6px' }}>{exp.company}</div>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {exp.bullets.map((b: string, j: number) => (
                          <li key={j} style={{ fontSize: '10pt', marginBottom: '4px', lineHeight: '1.4' }}>{b}</li>
                      ))}
                  </ul>
              </div>
          ))}
      </div>
    </div>
  );
});

HiddenResume.displayName = "HiddenResume";
