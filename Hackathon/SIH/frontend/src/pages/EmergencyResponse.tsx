import { useState } from 'react'
import {
  AlertTriangle,
  Share2,
  FileText,
  CheckCircle2,
  Circle,
  Search,
  Wind,
  Waves,
  Compass,
  Thermometer,
  Send,
  Radio,
  Anchor,
  Ship,
  Plane,
  X
} from 'lucide-react'
import MapView from '../components/MapView'

export default function EmergencyResponse() {
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [showEscalateModal, setShowEscalateModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [notified, setNotified] = useState(false)
  const [alerted, setAlerted] = useState(false)

  // Map layer toggles matching screenshot
  const [mapLayers, setMapLayers] = useState({
    satelliteImagery: true,
    detectedSpill: true,
    predictedDrift24: true,
    predictedDrift48: true,
    predictedDrift72: true,
    vesselTracks: true,
    responseAssets: true,
    portsInfrastructure: true,
    sensitiveAreas: true,
    eezBoundary: false
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const toggleLayer = (key: keyof typeof mapLayers) => {
    setMapLayers(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleEscalateTier = () => {
    setShowEscalateModal(true)
  }

  const handleNotifyAuthority = () => {
    setNotified(true)
    showToast('Emergency Incident Notice dispatched to DG Shipping & Coast Guard Command')
  }

  const handleAlertNearbyVessels = () => {
    setAlerted(true)
    showToast('NAVTEX Broadcast & AIS Safety Alert transmitted to 23 vessels in sector')
  }

  const handleShareLocation = () => {
    navigator.clipboard?.writeText('https://marineguard.ai/incident/NTC-2026-09-0911')
    showToast('Incident location & telemetry link copied to clipboard')
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: 'auto',
      background: '#010a15',
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '16px',
      gap: '14px'
    }}>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: 'rgba(4, 21, 37, 0.95)', border: '1px solid var(--accent-cyan)',
          boxShadow: '0 0 20px rgba(0, 204, 255, 0.4)', borderRadius: 6,
          padding: '10px 16px', color: '#fff', fontFamily: 'JetBrains Mono', fontSize: 11,
          display: 'flex', alignItems: 'center', gap: 10
        }}>
          <CheckCircle2 size={16} color="var(--accent-cyan)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Escalate to Tier 3 Modal */}
      {showEscalateModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#020b18', border: '1px solid #ff3355',
            borderRadius: 8, padding: '24px', width: 480,
            boxShadow: '0 0 35px rgba(255, 51, 85, 0.4)', fontFamily: 'JetBrains Mono'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#ff3355', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={18} color="#ff3355" /> ESCALATE TO INCIDENT TIER 3
              </div>
              <button onClick={() => setShowEscalateModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              Escalating to <strong>Tier 3 (National Major Spill Protocol)</strong> will activate Joint Disaster Response Forces, notify the Ministry of Environment & Defense, and request international assistance under the SACEP Mutual Assistance Block.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  setShowEscalateModal(false)
                  showToast('CRITICAL: Tier 3 Escalation Protocol Activated. National Response Center Notified.')
                }}
                style={{ flex: 1, background: '#ff3355', color: '#fff', fontWeight: 800, border: 'none', padding: '10px', borderRadius: 4, cursor: 'pointer' }}
              >
                CONFIRM TIER 3 ESCALATION
              </button>
              <button
                onClick={() => setShowEscalateModal(false)}
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border-primary)', padding: '10px 16px', borderRadius: 4, cursor: 'pointer' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Incident Report Modal */}
      {showReportModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#020b18', border: '1px solid var(--accent-cyan)',
            borderRadius: 8, padding: '24px', width: 500,
            boxShadow: '0 0 35px rgba(0, 204, 255, 0.35)', fontFamily: 'JetBrains Mono'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-cyan)' }}>
                EMERGENCY RESPONSE INCIDENT REPORT
              </div>
              <button onClick={() => setShowReportModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>• Incident Reference: <strong>NTC-2026-09-0911</strong></div>
              <div>• Detected Time: <strong>2026-09-21 03:38 UTC (3h 36m ago)</strong></div>
              <div>• Location Centroid: <strong>13.182° N, 80.314° E</strong></div>
              <div>• Current Slick Extent: <strong>12.8 km² (~1,420 bbl)</strong></div>
              <div>• Estimated Coastal Contact: <strong>Chennai Coastline in ~34 Hours</strong></div>
              <div>• Deployed Response Vessels: <strong>ICGS Vajra (On Route)</strong></div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button
                onClick={() => {
                  setShowReportModal(false)
                  showToast('Incident Report NTC-2026-09-0911 exported as PDF')
                }}
                style={{ flex: 1, background: 'var(--accent-cyan)', color: '#000', fontWeight: 800, border: 'none', padding: '10px', borderRadius: 4, cursor: 'pointer' }}
              >
                DOWNLOAD PDF REPORT
              </button>
              <button onClick={() => setShowReportModal(false)} style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border-primary)', padding: '10px 16px', borderRadius: 4, cursor: 'pointer' }}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', marginBottom: 2 }}>
            Home &gt; <span style={{ color: 'var(--accent-cyan)' }}>Emergency Response</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Emergency Response
          </h1>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            Take action on confirmed or high-probability oil spills with real-time situational awareness and coordination tools.
          </div>
        </div>

        {/* Top Right Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleEscalateTier}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#ff3355', color: '#fff', border: 'none', borderRadius: 6,
              padding: '8px 14px', fontSize: 11, fontWeight: 800, fontFamily: 'JetBrains Mono',
              cursor: 'pointer', boxShadow: '0 0 12px rgba(255, 51, 85, 0.4)'
            }}
          >
            <AlertTriangle size={13} color="#fff" /> Escalate to Tier 3
          </button>

          <button
            onClick={handleShareLocation}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--bg-secondary)', color: '#fff', border: '1px solid var(--border-primary)', borderRadius: 6,
              padding: '8px 14px', fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono', cursor: 'pointer'
            }}
          >
            <Share2 size={13} color="var(--accent-cyan)" /> Share
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#00ccff', color: '#000', border: 'none', borderRadius: 6,
              padding: '8px 16px', fontSize: 11, fontWeight: 800, fontFamily: 'JetBrains Mono',
              cursor: 'pointer', boxShadow: '0 0 15px rgba(0, 204, 255, 0.4)'
            }}
          >
            <FileText size={13} fill="#000" /> Generate Report
          </button>
        </div>
      </div>

      {/* 2. Incident Tier & Pipeline Workflow Bar */}
      <div className="glass-card" style={{
        padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        border: '1px solid var(--accent-red-dim)', background: 'rgba(239, 68, 68, 0.05)', flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            background: 'rgba(239, 68, 68, 0.25)', border: '1px solid #ff3355',
            color: '#ff3355', fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 4,
            fontFamily: 'JetBrains Mono', boxShadow: '0 0 10px rgba(255, 51, 85, 0.3)'
          }}>
            INCIDENT TIER 2 - ACTIVE
          </span>
          <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
            Ref: <span style={{ color: '#fff' }}>NTC-2026-09-0911</span> | Sector: <span style={{ color: 'var(--text-primary)' }}>Coromandel East (Chennai Deepwater)</span>
          </div>
        </div>

        {/* Workflow Node Step Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 10, fontFamily: 'JetBrains Mono' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#00ff88' }}>
            <CheckCircle2 size={13} color="#00ff88" /> <span>Detected</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#00ff88' }}>
            <CheckCircle2 size={13} color="#00ff88" /> <span>Validated</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#00ff88' }}>
            <CheckCircle2 size={13} color="#00ff88" /> <span>Source Estimated</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#00ff88' }}>
            <CheckCircle2 size={13} color="#00ff88" /> <span>AIS Analyzed</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ff3355', fontWeight: 800 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff3355', boxShadow: '0 0 8px #ff3355' }} />
            <span>Alert Ready</span>
          </div>
          <span style={{ color: 'var(--text-muted)' }}>➔</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
            <Circle size={10} color="var(--text-muted)" /> <span>Response Active</span>
          </div>
        </div>
      </div>

      {/* 3. Main Middle Split Layout (Map on Left, Alert & Response on Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 1fr', gap: '12px', flex: 1, minHeight: 400 }}>
        
        {/* LEFT: Tactical Map View */}
        <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          
          {/* Top In-Map Search Bar */}
          <div style={{
            position: 'absolute', top: 12, left: 12, zIndex: 1000,
            display: 'flex', alignItems: 'center', background: 'rgba(2, 11, 24, 0.9)',
            backdropFilter: 'blur(8px)', border: '1px solid var(--accent-cyan-dim)',
            borderRadius: 6, padding: '4px 10px', width: 280,
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}>
            <Search size={13} color="var(--accent-cyan)" style={{ marginRight: 8 }} />
            <input
              type="text"
              placeholder="Search location (port, vessel, coords...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontSize: 10, fontFamily: 'JetBrains Mono', width: '100%'
              }}
            />
          </div>

          {/* Floating Map Layers Overlay Panel (Top Left) */}
          <div style={{
            position: 'absolute', top: 48, left: 12, zIndex: 1000,
            background: 'rgba(2, 11, 24, 0.92)', backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-primary)', borderRadius: 6,
            padding: '10px 12px', fontFamily: 'JetBrains Mono', fontSize: 9,
            display: 'flex', flexDirection: 'column', gap: 5, width: 200,
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}>
            <div style={{ color: 'var(--accent-cyan)', fontWeight: 800, marginBottom: 2 }}>Map Layers</div>
            {(Object.keys(mapLayers) as Array<keyof typeof mapLayers>).map(key => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: mapLayers[key] ? '#fff' : 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  checked={mapLayers[key]}
                  onChange={() => toggleLayer(key)}
                  style={{ accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />
                <span>
                  {key === 'satelliteImagery' && 'Satellite Imagery'}
                  {key === 'detectedSpill' && 'Detected Spill (Current)'}
                  {key === 'predictedDrift24' && '- Predicted Drift (24h)'}
                  {key === 'predictedDrift48' && '- Predicted Drift (48h)'}
                  {key === 'predictedDrift72' && '- Predicted Drift (72h)'}
                  {key === 'vesselTracks' && '- Vessel Tracks (AIS)'}
                  {key === 'responseAssets' && '- Response Assets'}
                  {key === 'portsInfrastructure' && '- Ports & Infrastructure'}
                  {key === 'sensitiveAreas' && '- Sensitive Areas'}
                  {key === 'eezBoundary' && 'EEZ Boundary'}
                </span>
              </label>
            ))}
          </div>

          {/* Floating Map Legend Panel (Top Right) */}
          <div style={{
            position: 'absolute', top: 12, right: 12, zIndex: 1000,
            background: 'rgba(2, 11, 24, 0.92)', backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-primary)', borderRadius: 6,
            padding: '10px 12px', fontFamily: 'JetBrains Mono', fontSize: 9,
            display: 'flex', flexDirection: 'column', gap: 4,
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, background: '#ff3355', borderRadius: 2 }} />
              <span>Current Spill</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 2, background: '#eab308', strokeDasharray: '2 2' }} />
              <span>24h Drift</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 2, background: '#f97316', strokeDasharray: '2 2' }} />
              <span>48h Drift</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 2, background: '#ff3355', strokeDasharray: '2 2' }} />
              <span>72h Drift</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '8px solid #ff3355' }} />
              <span>Vessel (Suspicious)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '8px solid #00ccff' }} />
              <span>Vessel (Other)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '8px solid #00ff88' }} />
              <span>Response Vessel</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Anchor size={11} color="var(--accent-cyan)" />
              <span>Port</span>
            </div>
          </div>

          {/* Interactive Leaflet Map */}
          <div style={{ flex: 1, position: 'relative' }}>
            <MapView
              center={[13.182, 80.314]}
              zoom={11}
              showSpill={mapLayers.detectedSpill}
              showVessels={mapLayers.vesselTracks}
              showDriftTrail={mapLayers.predictedDrift24}
            />

            {/* Map Overlay Callouts matching reference image */}
            <div style={{
              position: 'absolute', top: '22%', right: '35%', zIndex: 1000,
              background: 'rgba(239, 68, 68, 0.25)', border: '1px solid #ff3355',
              color: '#fff', fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 800,
              padding: '3px 8px', borderRadius: 4, boxShadow: '0 0 10px rgba(255, 51, 85, 0.4)',
              textAlign: 'center'
            }}>
              MV OCEAN STAR
              <div style={{ fontSize: 7, color: '#ff3355' }}>(Suspect Vessel)</div>
            </div>

            <div style={{
              position: 'absolute', bottom: '25%', left: '32%', zIndex: 1000,
              background: 'rgba(0, 255, 136, 0.2)', border: '1px solid #00ff88',
              color: '#fff', fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 800,
              padding: '3px 8px', borderRadius: 4, boxShadow: '0 0 10px rgba(0, 255, 136, 0.4)',
              textAlign: 'center'
            }}>
              ICGS VAJRA
              <div style={{ fontSize: 7, color: '#00ff88' }}>(On Route)</div>
            </div>

            {/* Coastline Port Indicators */}
            <div style={{ position: 'absolute', top: '35%', left: '26%', zIndex: 1000, color: '#fff', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 800 }}>
              ⚓ Ennore Port
            </div>
            <div style={{ position: 'absolute', bottom: '30%', left: '20%', zIndex: 1000, color: '#fff', fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 800 }}>
              Chennai Port
            </div>
            <div style={{ position: 'absolute', bottom: '45%', left: '16%', zIndex: 1000, color: 'var(--text-muted)', fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
              Chennai
            </div>

            {/* Spill Area Floating Callout */}
            <div style={{
              position: 'absolute', top: '48%', left: '28%', zIndex: 1000,
              background: 'rgba(255, 51, 85, 0.9)', color: '#fff', fontSize: 8,
              fontFamily: 'JetBrains Mono', fontWeight: 900, padding: '2px 6px', borderRadius: 3
            }}>
              Slick Area: 12.8 km²
            </div>

            {/* Scale & Coordinates Overlay */}
            <div style={{
              position: 'absolute', bottom: 12, left: 12, zIndex: 1000,
              background: 'rgba(2, 11, 24, 0.85)', padding: '4px 10px', borderRadius: 4,
              fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)', border: '1px solid var(--border-primary)'
            }}>
              13.182° N, 80.314° E
            </div>

            <div style={{
              position: 'absolute', bottom: 12, right: 12, zIndex: 1000,
              background: 'rgba(2, 11, 24, 0.85)', padding: '4px 10px', borderRadius: 4,
              fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)', border: '1px solid var(--border-primary)',
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              <span>0  10  20  40 km</span>
            </div>
          </div>
        </div>

        {/* RIGHT: MARITIME OIL SPILL ALERT & ACTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
          
          {/* A. Critical Alert Card */}
          <div className="glass-card" style={{ padding: '12px', border: '1px solid #ff3355', background: 'rgba(239, 68, 68, 0.08)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: '#ff3355', fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={15} color="#ff3355" /> MARITIME OIL SPILL ALERT
              </div>
              <span style={{
                border: '1px solid #ff3355', color: '#ff3355', fontSize: 9,
                fontFamily: 'JetBrains Mono', fontWeight: 900, padding: '1px 6px', borderRadius: 3
              }}>
                CRITICAL
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 9, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Incident Ref</span>
                <span style={{ color: '#fff' }}>NTC-2026-09-0911</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Detected</span>
                <span style={{ color: '#fff' }}>2026-09-21 03:38 UTC (3h 36m ago)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Location (Centroid)</span>
                <span style={{ color: '#fff' }}>13.182° N, 80.314° E</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Spill Area (Current)</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>12.8 km² (~1,420 bbl)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Confidence</span>
                <span style={{ color: '#00ff88', fontWeight: 800 }}>94%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Probable Origin</span>
                <span style={{ color: '#fff' }}>13.164° N, 80.287° E</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Sector</span>
                <span style={{ color: '#fff' }}>Coromandel East (Chennai Deepwater)</span>
              </div>
            </div>
          </div>

          {/* B. Weather & Ocean Conditions */}
          <div className="glass-card" style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'JetBrains Mono' }}>
              <span style={{ fontWeight: 800, color: '#fff' }}>WEATHER & OCEAN CONDITIONS</span>
              <span style={{ color: 'var(--text-muted)' }}>Last Updated: 15:50 UTC</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '6px 8px', borderRadius: 4, border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Wind size={16} color="var(--accent-cyan)" />
                <div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>Wind</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono' }}>11.2 kts</div>
                  <div style={{ fontSize: 7, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>NE (048°)</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '6px 8px', borderRadius: 4, border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Waves size={16} color="var(--accent-cyan)" />
                <div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>Wave Height</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono' }}>1.1 m</div>
                  <div style={{ fontSize: 7, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>Moderate</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '6px 8px', borderRadius: 4, border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Compass size={16} color="var(--accent-cyan)" />
                <div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>Sea Current</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono' }}>0.68 m/s</div>
                  <div style={{ fontSize: 7, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>NE</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '6px 8px', borderRadius: 4, border: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Thermometer size={16} color="var(--accent-cyan)" />
                <div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>Sea Surface Temp</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono' }}>28.4 °C</div>
                </div>
              </div>
            </div>
          </div>

          {/* C. Response Recommendations */}
          <div className="glass-card" style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 800, color: '#fff' }}>
              RESPONSE RECOMMENDATIONS
            </div>
            <div style={{ fontSize: 8, fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)', marginBottom: 2 }}>
              Priority Actions (AI Suggested)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 9, fontFamily: 'JetBrains Mono' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#ff3355', color: '#fff', fontSize: 8, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</span>
                <span>Deploy surveillance vessel for visual confirmation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#f97316', color: '#fff', fontSize: 8, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</span>
                <span>Alert nearest response vessels (ICGS)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#eab308', color: '#000', fontSize: 8, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>3</span>
                <span>Monitor drift path towards coastline</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#00ccff', color: '#000', fontSize: 8, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>4</span>
                <span>Notify port authorities (Chennai, Ennore)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#00ccff', color: '#000', fontSize: 8, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>5</span>
                <span>Continue AIS monitoring of suspect vessels</span>
              </div>
            </div>
          </div>

          {/* D. Action Buttons Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              onClick={handleNotifyAuthority}
              style={{
                background: notified ? '#00ff88' : '#ff3355',
                color: notified ? '#000' : '#fff',
                border: 'none', borderRadius: 6, padding: '10px',
                fontSize: 10, fontWeight: 900, fontFamily: 'JetBrains Mono',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: notified ? '0 0 10px rgba(0,255,136,0.4)' : '0 0 10px rgba(255,51,85,0.4)'
              }}
            >
              <Send size={13} /> {notified ? 'NOTIFIED ✓' : 'Notify Authority'}
            </button>

            <button
              onClick={handleAlertNearbyVessels}
              style={{
                background: alerted ? 'rgba(0, 255, 136, 0.2)' : '#00ff88',
                color: alerted ? '#00ff88' : '#000',
                border: alerted ? '1px solid #00ff88' : 'none', borderRadius: 6, padding: '10px',
                fontSize: 10, fontWeight: 900, fontFamily: 'JetBrains Mono',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: '0 0 10px rgba(0,255,136,0.3)'
              }}
            >
              <Radio size={13} /> {alerted ? 'ALERTED ✓' : 'Alert Nearby Vessels'}
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              style={{
                background: 'rgba(0, 204, 255, 0.1)',
                border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)',
                borderRadius: 6, padding: '8px', fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}
            >
              <FileText size={12} /> Generate Report
            </button>

            <button
              onClick={handleShareLocation}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)', color: '#fff',
                borderRadius: 6, padding: '8px', fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}
            >
              <Share2 size={12} /> Share Location
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: 3 Dynamic Panels (Drift Forecast, Impact Zones, Response Assets) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', flexShrink: 0 }}>
        
        {/* Panel 1: DRIFT FORECAST (AREA IMPACT) */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 9, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff' }}>
            DRIFT FORECAST (AREA IMPACT)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '8px', borderRadius: 4, border: '1px solid var(--border-primary)' }}>
              <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>24 HOURS</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>28.7 km²</div>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>➔ NE Direction</div>
            </div>
            <div style={{ background: 'var(--bg-secondary)', padding: '8px', borderRadius: 4, border: '1px solid var(--border-primary)' }}>
              <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>48 HOURS</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#f97316', fontFamily: 'JetBrains Mono' }}>46.1 km²</div>
              <div style={{ fontSize: 7, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>➔ Near Coastal Zone</div>
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '8px', borderRadius: 4, border: '1px solid #ff3355' }}>
              <div style={{ fontSize: 8, color: '#ff3355', fontFamily: 'JetBrains Mono', fontWeight: 800 }}>72 HOURS</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#ff3355', fontFamily: 'JetBrains Mono' }}>78.4 km²</div>
              <div style={{ fontSize: 7, color: '#ff3355', fontFamily: 'JetBrains Mono', fontWeight: 800 }}>➔ High Risk (Coastline)</div>
            </div>
          </div>
        </div>

        {/* Panel 2: POTENTIAL IMPACT ZONES */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 9, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff' }}>
            POTENTIAL IMPACT ZONES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 9, fontFamily: 'JetBrains Mono' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Anchor size={11} color="var(--accent-cyan)" />
                <span>Chennai Coastline</span>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>~ 34 hours</span>
              <span style={{ background: 'rgba(239, 68, 68, 0.25)', color: '#ff3355', border: '1px solid #ff3355', padding: '1px 6px', borderRadius: 3, fontWeight: 800 }}>High</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Anchor size={11} color="var(--accent-cyan)" />
                <span>Ennore Port</span>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>~ 38 hours</span>
              <span style={{ background: 'rgba(249, 115, 22, 0.25)', color: '#f97316', border: '1px solid #f97316', padding: '1px 6px', borderRadius: 3, fontWeight: 800 }}>Moderate</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Anchor size={11} color="var(--accent-cyan)" />
                <span>Pulicat Lake (Sensitive)</span>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>~ 52 hours</span>
              <span style={{ background: 'rgba(249, 115, 22, 0.25)', color: '#f97316', border: '1px solid #f97316', padding: '1px 6px', borderRadius: 3, fontWeight: 800 }}>Moderate</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Anchor size={11} color="var(--accent-cyan)" />
                <span>Fisheries Zone</span>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>~ 60 hours</span>
              <span style={{ background: 'rgba(0, 255, 136, 0.2)', color: '#00ff88', border: '1px solid #00ff88', padding: '1px 6px', borderRadius: 3, fontWeight: 800 }}>Low</span>
            </div>
          </div>
        </div>

        {/* Panel 3: AVAILABLE RESPONSE ASSETS */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, fontFamily: 'JetBrains Mono' }}>
            <span style={{ fontWeight: 800, color: '#fff' }}>AVAILABLE RESPONSE ASSETS</span>
            <span style={{ color: 'var(--accent-cyan)', cursor: 'pointer' }}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 9, fontFamily: 'JetBrains Mono' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Ship size={12} color="#00ff88" />
                <span style={{ color: '#fff', fontWeight: 700 }}>ICGS Vajra</span>
              </div>
              <span style={{ color: '#00ff88', fontWeight: 800 }}>● On Route</span>
              <span style={{ color: 'var(--text-muted)' }}>18 km | 31 min</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Ship size={12} color="var(--accent-cyan)" />
                <span style={{ color: '#fff' }}>ICGS Samudra Prahari</span>
              </div>
              <span style={{ color: 'var(--accent-cyan)' }}>● Standby</span>
              <span style={{ color: 'var(--text-muted)' }}>45 km | 1.2 hr</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Ship size={12} color="var(--accent-cyan)" />
                <span style={{ color: '#fff' }}>INS Sharda</span>
              </div>
              <span style={{ color: 'var(--accent-cyan)' }}>● Available</span>
              <span style={{ color: 'var(--text-muted)' }}>120 km | 2.8 hr</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plane size={12} color="var(--accent-cyan)" />
                <span style={{ color: '#fff' }}>Air Surveillance (Do-228)</span>
              </div>
              <span style={{ color: 'var(--accent-cyan)' }}>● Available</span>
              <span style={{ color: 'var(--text-muted)' }}>Ready | 0.5 hr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
