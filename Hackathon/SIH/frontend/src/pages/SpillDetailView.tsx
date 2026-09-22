import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShieldAlert, MapPin, Calendar, Clock, Radio, Layers, CheckCircle2 } from 'lucide-react'
import { getSarImage, SAR_SEGMENTED_IMAGES, type SarSegmentedImage } from '../utils/sarImages'

export default function SpillDetailView() {
  const { id } = useParams<{ id: string }>()
  const spillId = id ? parseInt(id, 10) : 1
  const spill: SarSegmentedImage = getSarImage(spillId)

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return { bg: 'rgba(239, 68, 68, 0.2)', color: '#ff3355', border: '1px solid #ff3355' }
      case 'SEVERE':
        return { bg: 'rgba(249, 115, 22, 0.2)', color: '#f97316', border: '1px solid #f97316' }
      case 'HIGH':
        return { bg: 'rgba(234, 179, 8, 0.2)', color: '#eab308', border: '1px solid #eab308' }
      case 'MODERATE':
        return { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid #3b82f6' }
      default:
        return { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid #10b981' }
    }
  }

  const severityBadge = getSeverityStyle(spill.severityLevel)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#010a15',
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Standalone Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        background: 'rgba(4, 21, 37, 0.9)',
        border: '1px solid var(--border-primary)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/command-center"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent-cyan)',
              textDecoration: 'none',
              fontSize: 12,
              fontFamily: 'JetBrains Mono',
              fontWeight: 600,
              padding: '6px 12px',
              background: 'rgba(0, 204, 255, 0.1)',
              border: '1px solid var(--accent-cyan-dim)',
              borderRadius: 4
            }}
          >
            <ArrowLeft size={14} /> RETURN TO DASHBOARD
          </Link>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="tag-cyan" style={{ fontSize: 9 }}>OIL SPILL INSPECTION TAB</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                {spill.spillNo} // {spill.orbitPass}
              </span>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '2px 0 0 0', fontFamily: 'JetBrains Mono' }}>
              Detailed Inspection Record: {spill.spillNo}
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '6px 14px',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 800,
            fontFamily: 'JetBrains Mono',
            ...severityBadge
          }}>
            SEVERITY: {spill.severityLevel}
          </div>

          <div style={{
            padding: '6px 14px',
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid #00ff88',
            color: '#00ff88',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: 'JetBrains Mono',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <Radio size={14} /> {spill.notifiedAlert}
          </div>
        </div>
      </div>

      {/* Main Grid: Image Viewer & Analysis */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', flex: 1 }}>
        {/* Left: Highlighted Oil Spill Image Card */}
        <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} color="var(--accent-cyan)" />
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono', color: '#fff' }}>
                SAR SATELLITE OIL SPILL IMAGE (HIGHLIGHTED SLICK AREA)
              </span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>
              RESOLUTION: 10M C-BAND RADAR
            </span>
          </div>

          {/* High Resolution Image Container with Highlighted Overlay */}
          <div style={{
            position: 'relative',
            height: 440,
            background: '#000',
            borderRadius: 6,
            overflow: 'hidden',
            border: '2px solid var(--accent-cyan)',
            boxShadow: '0 0 25px rgba(0, 204, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Real SAR Segmented Image */}
            <img
              src={spill.path}
              alt={spill.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.95) contrast(120%)'
              }}
            />

            {/* Glowing Oil Spill Area Highlight Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 51, 85, 0.15) 0%, rgba(0, 204, 255, 0.2) 60%, transparent 80%)',
              pointerEvents: 'none'
            }} />

            {/* Simulated AI Bounding Box Highlight on Image */}
            <div style={{
              position: 'absolute',
              top: '25%',
              left: '20%',
              width: '55%',
              height: '50%',
              border: '2px dashed #ff3355',
              boxShadow: '0 0 20px rgba(255, 51, 85, 0.6), inset 0 0 15px rgba(255, 51, 85, 0.3)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '6px',
              pointerEvents: 'none'
            }}>
              <div style={{
                background: '#ff3355',
                color: '#fff',
                fontSize: 9,
                fontWeight: 800,
                fontFamily: 'JetBrains Mono',
                padding: '2px 6px',
                borderRadius: 2,
                alignSelf: 'flex-start'
              }}>
                HIGHLIGHTED SPILL ZONE: {spill.slickAreaKm2} km²
              </div>

              <div style={{
                background: 'rgba(2, 11, 24, 0.85)',
                color: 'var(--accent-cyan)',
                fontSize: 9,
                fontWeight: 700,
                fontFamily: 'JetBrains Mono',
                padding: '3px 8px',
                borderRadius: 2,
                alignSelf: 'flex-end',
                border: '1px solid var(--accent-cyan)'
              }}>
                CONFIDENCE: {spill.confidence}%
              </div>
            </div>

            {/* Floating Top Left Badge */}
            <div style={{
              position: 'absolute', top: 10, left: 10,
              background: 'rgba(1, 10, 20, 0.85)',
              border: '1px solid var(--border-primary)',
              borderRadius: 4, padding: '4px 10px',
              fontSize: 10, color: '#fff', fontFamily: 'JetBrains Mono',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <CheckCircle2 size={12} color="#00ff88" />
              <span>AI SEGMENTED MASK LOADED</span>
            </div>

            {/* Floating Bottom Right Controls */}
            <div style={{
              position: 'absolute', bottom: 10, right: 10,
              background: 'rgba(1, 10, 20, 0.85)',
              border: '1px solid var(--border-primary)',
              borderRadius: 4, padding: '4px 10px',
              fontSize: 10, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono'
            }}>
              {spill.sensor} | {spill.polarization}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
            <span>ORIGINAL FILENAME: {spill.originalFilename}</span>
            <span>PATH: {spill.path}</span>
          </div>
        </div>

        {/* Right: Spill Entry Attributes Table & Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Spill Record Table Attributes */}
          <div className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0, fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldAlert size={16} color="#ff3355" /> SPILL INCIDENT ENTRY DETAILS
            </h3>

            <div className="divider" style={{ margin: '4px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'SPILL NO.', value: spill.spillNo, color: 'var(--accent-cyan)', bold: true },
                { label: 'DETECTION DATE', value: spill.date, icon: Calendar },
                { label: 'DETECTION TIME (AM/PM)', value: spill.timeAmPm, icon: Clock },
                { label: 'PLACE OF SPILL', value: spill.placeOfSpill, icon: MapPin },
                { label: 'GEOGRAPHIC COORDINATES', value: spill.coordinates.formatted },
                { label: 'SEVERITY LEVEL', value: spill.severityLevel, color: severityBadge.color, bold: true },
                { label: 'NOTIFIED ALERT STATUS', value: spill.notifiedAlert, color: '#00ff88', bold: true },
                { label: 'SURFACE SLICK AREA', value: `${spill.slickAreaKm2} km²` },
                { label: 'AI CONFIDENCE SCORE', value: `${spill.confidence}%` },
                { label: 'PROBABLE VESSEL SUSPECT', value: spill.vesselSuspect || 'UNDER INVESTIGATION' },
                { label: 'VESSEL MMSI', value: spill.mmsi || 'N/A' },
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 4
                }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {item.icon && <item.icon size={12} color="var(--text-muted)" />}
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: 11,
                    color: item.color || '#fff',
                    fontWeight: item.bold ? 800 : 600,
                    fontFamily: 'JetBrains Mono'
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Nav across 15 spill entries */}
          <div className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
              NAVIGATE ALL 15 SPILL ENTRIES
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
              {SAR_SEGMENTED_IMAGES.map((s) => (
                <Link
                  key={s.id}
                  to={`/spill-detail/${s.id}`}
                  style={{
                    padding: '6px 4px',
                    textAlign: 'center',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 700,
                    borderRadius: 3,
                    textDecoration: 'none',
                    background: s.id === spill.id ? 'var(--accent-cyan)' : 'var(--bg-secondary)',
                    color: s.id === spill.id ? '#000' : 'var(--text-secondary)',
                    border: s.id === spill.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-primary)'
                  }}
                >
                  #{s.id}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
