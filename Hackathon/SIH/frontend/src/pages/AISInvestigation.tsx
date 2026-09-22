import { useState } from 'react'
import {
  Ship,
  AlertTriangle,
  Target,
  WifiOff,
  TrendingUp,
  Calendar,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  Eye,
  FileText,
  CheckCircle2,
  X
} from 'lucide-react'
import MapView from '../components/MapView'

interface VesselCandidate {
  id: number
  name: string
  imo: string
  mmsi: string
  type: string
  flag: string
  distance: string
  timeMatch: string
  behaviorScore: number
  overallScore: number
  status: 'SUSPICIOUS' | 'WARNING' | 'CLEAR'
  lastPos: string
  speed: string
  course: string
  lastSignal: string
  image: string
}

const VESSEL_CANDIDATES: VesselCandidate[] = [
  {
    id: 1,
    name: 'MV OCEAN STAR',
    imo: '9482718',
    mmsi: '563210000',
    type: 'Crude Oil Tanker',
    flag: 'Marshall Islands',
    distance: '12.4 km',
    timeMatch: '92%',
    behaviorScore: 0.87,
    overallScore: 87,
    status: 'SUSPICIOUS',
    lastPos: '13.268° N, 80.621° E',
    speed: '2.1 knots',
    course: '68° (ENE)',
    lastSignal: '2025-06-02 03:48 UTC',
    image: '/vessels/ocean_star.png'
  },
  {
    id: 2,
    name: 'MV BLUE WAVE',
    imo: '9313842',
    mmsi: '636015421',
    type: 'Bulk Carrier',
    flag: 'Liberia (LR)',
    distance: '28.7 km',
    timeMatch: '76%',
    behaviorScore: 0.64,
    overallScore: 64,
    status: 'WARNING',
    lastPos: '13.310° N, 80.520° E',
    speed: '12.4 knots',
    course: '38° (NE)',
    lastSignal: '2025-06-02 04:15 UTC',
    image: '/vessels/ocean_star.png'
  },
  {
    id: 3,
    name: 'MV SEA PEARL',
    imo: '9153284',
    mmsi: '352001928',
    type: 'Container Ship',
    flag: 'Panama (PA)',
    distance: '46.1 km',
    timeMatch: '58%',
    behaviorScore: 0.42,
    overallScore: 42,
    status: 'WARNING',
    lastPos: '13.110° N, 80.410° E',
    speed: '18.1 knots',
    course: '74° (ENE)',
    lastSignal: '2025-06-02 04:45 UTC',
    image: '/vessels/ocean_star.png'
  },
  {
    id: 4,
    name: 'MV HORIZON',
    imo: '9723165',
    mmsi: '477123900',
    type: 'Cargo Vessel',
    flag: 'Hong Kong (HK)',
    distance: '62.3 km',
    timeMatch: '31%',
    behaviorScore: 0.28,
    overallScore: 28,
    status: 'CLEAR',
    lastPos: '13.010° N, 80.710° E',
    speed: '14.2 knots',
    course: '120° (ESE)',
    lastSignal: '2025-06-02 05:10 UTC',
    image: '/vessels/ocean_star.png'
  },
  {
    id: 5,
    name: 'MV EASTERN',
    imo: '9256714',
    mmsi: '248991000',
    type: 'Chemical Tanker',
    flag: 'Malta (MT)',
    distance: '88.9 km',
    timeMatch: '24%',
    behaviorScore: 0.21,
    overallScore: 21,
    status: 'CLEAR',
    lastPos: '12.910° N, 80.820° E',
    speed: '10.8 knots',
    course: '190° (S)',
    lastSignal: '2025-06-02 05:40 UTC',
    image: '/vessels/ocean_star.png'
  }
]

export default function AISInvestigation() {
  const [selectedVessel, setSelectedVessel] = useState<VesselCandidate>(VESSEL_CANDIDATES[0])
  const [activeSubTab, setActiveSubTab] = useState<'map' | 'tracks' | 'anomalies' | 'gaps' | 'density' | 'playback'>('map')
  const [activeDossierTab, setActiveDossierTab] = useState<'overview' | 'trajectory' | 'behavior' | 'gaps' | 'events'>('overview')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<string>('10x')
  const [timelineVal, setTimelineVal] = useState<number>(45)
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [showReportModal, setShowReportModal] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<string>('2025-06-01 00:00 ➔ 2025-06-03 23:59')

  // Map layer toggles
  const [mapLayers, setMapLayers] = useState({
    satelliteSpill: true,
    spillDrift: true,
    vesselTracks: true,
    suspiciousVessels: true,
    otherVessels: true,
    ports: true,
    coastline: true,
    eezBoundary: false
  })

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const toggleMapLayer = (key: keyof typeof mapLayers) => {
    setMapLayers(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleRunAnalysis = () => {
    showToast('Running AIS Anomaly & Kinematics Correlation Engine...')
  }

  const handleGenerateReport = () => {
    setShowReportModal(true)
  }

  const getScoreBadgeStyle = (score: number) => {
    if (score >= 80) return { bg: 'rgba(239, 68, 68, 0.25)', color: '#ff3355', border: '1px solid #ff3355' }
    if (score >= 60) return { bg: 'rgba(249, 115, 22, 0.25)', color: '#f97316', border: '1px solid #f97316' }
    if (score >= 40) return { bg: 'rgba(234, 179, 8, 0.25)', color: '#eab308', border: '1px solid #eab308' }
    return { bg: 'rgba(100, 116, 139, 0.25)', color: '#94a3b8', border: '1px solid #64748b' }
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
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          background: 'rgba(4, 21, 37, 0.95)',
          border: '1px solid var(--accent-cyan)',
          boxShadow: '0 0 20px rgba(0, 204, 255, 0.4)',
          borderRadius: 6,
          padding: '10px 16px',
          color: '#fff',
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <CheckCircle2 size={16} color="var(--accent-cyan)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Date Range Modal */}
      {showDatePicker && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#020b18', border: '1px solid var(--accent-cyan)',
            borderRadius: 8, padding: '20px', width: 400,
            boxShadow: '0 0 30px rgba(0, 204, 255, 0.3)',
            fontFamily: 'JetBrains Mono'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent-cyan)' }}>SELECT AIS TIME WINDOW</div>
              <button onClick={() => setShowDatePicker(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 11 }}>
              <div>
                <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>START TIME (UTC)</label>
                <input
                  type="text"
                  defaultValue="2025-06-01 00:00"
                  style={{ width: '100%', background: '#010a15', border: '1px solid var(--border-primary)', padding: '8px', color: '#fff', borderRadius: 4 }}
                />
              </div>
              <div>
                <label style={{ color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>END TIME (UTC)</label>
                <input
                  type="text"
                  defaultValue="2025-06-03 23:59"
                  style={{ width: '100%', background: '#010a15', border: '1px solid var(--border-primary)', padding: '8px', color: '#fff', borderRadius: 4 }}
                />
              </div>
              <button
                onClick={() => {
                  setDateRange('2025-06-01 00:00 ➔ 2025-06-03 23:59')
                  setShowDatePicker(false)
                  showToast('AIS Time Window updated to 2025-06-01 ➔ 2025-06-03')
                }}
                style={{
                  background: 'var(--accent-cyan)', color: '#000', fontWeight: 800,
                  border: 'none', padding: '10px', borderRadius: 4, cursor: 'pointer', marginTop: 8
                }}
              >
                APPLY TIME WINDOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Investigation Report Modal */}
      {showReportModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#020b18', border: '1px solid var(--accent-cyan)',
            borderRadius: 8, padding: '24px', width: 520, maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 0 35px rgba(0, 204, 255, 0.35)',
            fontFamily: 'JetBrains Mono'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-cyan)' }}>
                MARITIME INCIDENT DOSSIER REPORT
              </div>
              <button onClick={() => setShowReportModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ background: 'rgba(0, 204, 255, 0.08)', padding: 10, borderRadius: 4, border: '1px solid var(--accent-cyan-dim)' }}>
                <div style={{ fontWeight: 800, color: '#fff' }}>TARGET VESSEL: {selectedVessel.name}</div>
                <div>IMO: {selectedVessel.imo} | MMSI: {selectedVessel.mmsi} | FLAG: {selectedVessel.flag}</div>
                <div>OVERALL SUSPICION SCORE: <span style={{ color: '#ff3355', fontWeight: 800 }}>{selectedVessel.overallScore}/100</span></div>
              </div>

              <div>
                <div style={{ fontWeight: 800, color: '#fff', marginBottom: 4 }}>KINEMATIC & TEMPORAL CORRELATION:</div>
                <div>• Closest Approach to Spill Origin: <strong>{selectedVessel.distance}</strong></div>
                <div>• Spatial-Temporal Match Confidence: <strong>{selectedVessel.timeMatch}</strong></div>
                <div>• Speed Anomaly: <strong>Speed Drop + 40-minute AIS Silence</strong></div>
                <div>• Hydrodynamic Drift Path Match: <strong>92.4% Trajectory Overlap</strong></div>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: 10, borderRadius: 4, border: '1px solid #ff3355' }}>
                <div style={{ fontWeight: 800, color: '#ff3355' }}>RECOMMENDED ACTION:</div>
                <div>Transmit formal notice to Coast Guard Command and issue MARPOL inspection order upon port arrival.</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button
                onClick={() => {
                  setShowReportModal(false)
                  showToast(`Report for ${selectedVessel.name} exported as PDF`)
                }}
                style={{
                  flex: 1, background: 'var(--accent-cyan)', color: '#000', fontWeight: 800,
                  border: 'none', padding: '10px', borderRadius: 4, cursor: 'pointer'
                }}
              >
                DOWNLOAD PDF REPORT
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                style={{
                  background: 'var(--bg-secondary)', color: 'var(--text-muted)',
                  border: '1px solid var(--border-primary)', padding: '10px 16px', borderRadius: 4, cursor: 'pointer'
                }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Header & Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', marginBottom: 2 }}>
            Home &gt; <span style={{ color: 'var(--accent-cyan)' }}>AIS Investigation</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            AIS Investigation
          </h1>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            Analyze vessel activities, correlate with satellite detections and identify potential responsible vessels.
          </div>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Date Picker Button */}
          <button
            onClick={() => setShowDatePicker(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(4, 21, 37, 0.9)',
              border: '1px solid var(--accent-cyan)',
              borderRadius: 6,
              padding: '7px 12px',
              fontSize: 11,
              fontFamily: 'JetBrains Mono',
              fontWeight: 700,
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(0, 204, 255, 0.2)'
            }}
          >
            <Calendar size={13} color="var(--accent-cyan)" />
            <span>{dateRange}</span>
            <ChevronDown size={12} color="var(--accent-cyan)" />
          </button>

          {/* Run Analysis Button */}
          <button
            onClick={handleRunAnalysis}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#00ccff',
              color: '#000',
              border: 'none',
              borderRadius: 6,
              padding: '8px 18px',
              fontSize: 12,
              fontWeight: 800,
              fontFamily: 'JetBrains Mono',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(0, 204, 255, 0.4)'
            }}
          >
            <Play size={13} fill="#000" /> Run Analysis
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards (5 Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', flexShrink: 0 }}>
        
        {/* Card 1: Total Vessels */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(0, 204, 255, 0.1)', padding: 10, borderRadius: 6, border: '1px solid var(--accent-cyan-dim)' }}>
            <Ship size={20} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>TOTAL VESSELS IN AOI</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono' }}>
              142
            </div>
            <div style={{ fontSize: 9, color: '#00ff88', fontFamily: 'JetBrains Mono' }}>+12% vs. previous window</div>
          </div>
        </div>

        {/* Card 2: Suspicious Vessels */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: 10, borderRadius: 6, border: '1px solid #ff3355' }}>
            <AlertTriangle size={20} color="#ff3355" />
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>SUSPICIOUS VESSELS</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#ff3355', fontFamily: 'JetBrains Mono' }}>
              7
            </div>
            <div style={{ fontSize: 9, color: '#ff3355', fontFamily: 'JetBrains Mono' }}>Anomalous behavior</div>
          </div>
        </div>

        {/* Card 3: Vessels Near Spill */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(0, 204, 255, 0.1)', padding: 10, borderRadius: 6, border: '1px solid var(--accent-cyan-dim)' }}>
            <Target size={20} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>VESSELS NEAR SPILL</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>
              23
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>within 50 km</div>
          </div>
        </div>

        {/* Card 4: AIS Gaps Detected */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: 10, borderRadius: 6, border: '1px solid #eab308' }}>
            <WifiOff size={20} color="#eab308" />
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>AIS GAPS DETECTED</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#eab308', fontFamily: 'JetBrains Mono' }}>
              5
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>in selected vessels</div>
          </div>
        </div>

        {/* Card 5: Coverage */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(0, 255, 136, 0.1)', padding: 10, borderRadius: 6, border: '1px solid #00ff88' }}>
            <TrendingUp size={20} color="#00ff88" />
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>COVERAGE</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#00ff88', fontFamily: 'JetBrains Mono' }}>
              96.4%
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>AIS data availability</div>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation / Filter Bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)', gap: 6, flexShrink: 0 }}>
        {[
          { id: 'map', label: 'Map View' },
          { id: 'tracks', label: 'Tracks' },
          { id: 'anomalies', label: 'Anomalies' },
          { id: 'gaps', label: 'AIS Gaps' },
          { id: 'density', label: 'Density' },
          { id: 'playback', label: 'Playback' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            style={{
              padding: '8px 16px',
              fontSize: 11,
              fontFamily: 'JetBrains Mono',
              fontWeight: 700,
              border: 'none',
              borderRadius: '4px 4px 0 0',
              background: activeSubTab === tab.id ? 'var(--accent-cyan-dim)' : 'transparent',
              color: activeSubTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
              borderBottom: activeSubTab === tab.id ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Main Split Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', flex: 1, minHeight: 0 }}>
        
        {/* LEFT COLUMN: Map + Vessel Table + AIS Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          
          {/* A. Interactive Map View */}
          <div className="glass-card" style={{ height: 350, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <MapView
                center={[13.182, 80.314]}
                zoom={11}
                showSpill={mapLayers.satelliteSpill}
                showVessels={mapLayers.vesselTracks}
                showDriftTrail={mapLayers.spillDrift}
              />

              {/* Floating Map Layers Control Panel (Top Left) */}
              <div style={{
                position: 'absolute', top: 12, left: 12, zIndex: 1000,
                background: 'rgba(2, 11, 24, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-primary)',
                borderRadius: 6,
                padding: '10px 12px',
                fontFamily: 'JetBrains Mono',
                fontSize: 9,
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
              }}>
                {(Object.keys(mapLayers) as Array<keyof typeof mapLayers>).map(layerKey => (
                  <label key={layerKey} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: mapLayers[layerKey] ? '#fff' : 'var(--text-muted)' }}>
                    <input
                      type="checkbox"
                      checked={mapLayers[layerKey]}
                      onChange={() => toggleMapLayer(layerKey)}
                      style={{ accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                    />
                    <span>
                      {layerKey === 'satelliteSpill' && 'Satellite Spill (Detected)'}
                      {layerKey === 'spillDrift' && 'Spill Drift (Predicted)'}
                      {layerKey === 'vesselTracks' && 'Vessel Tracks (AIS)'}
                      {layerKey === 'suspiciousVessels' && 'Suspicious Vessels'}
                      {layerKey === 'otherVessels' && 'Other Vessels'}
                      {layerKey === 'ports' && 'Ports'}
                      {layerKey === 'coastline' && 'Coastline'}
                      {layerKey === 'eezBoundary' && 'EEZ Boundary'}
                    </span>
                  </label>
                ))}
              </div>

              {/* Map Floating Vessel Callouts (Matching Screenshot) */}
              <div style={{
                position: 'absolute', top: '25%', right: '35%', zIndex: 1000,
                background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ff3355',
                color: '#fff', fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 800,
                padding: '2px 6px', borderRadius: 3, boxShadow: '0 0 10px rgba(255, 51, 85, 0.4)',
                pointerEvents: 'none'
              }}>
                MV BLUE WAVE
              </div>

              <div style={{
                position: 'absolute', top: '35%', right: '20%', zIndex: 1000,
                background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ff3355',
                color: '#fff', fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 800,
                padding: '2px 6px', borderRadius: 3, boxShadow: '0 0 10px rgba(255, 51, 85, 0.4)',
                pointerEvents: 'none'
              }}>
                MV OCEAN STAR
              </div>

              <div style={{
                position: 'absolute', bottom: '30%', right: '40%', zIndex: 1000,
                background: 'rgba(249, 115, 22, 0.2)', border: '1px solid #f97316',
                color: '#fff', fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 800,
                padding: '2px 6px', borderRadius: 3, boxShadow: '0 0 10px rgba(249, 115, 22, 0.4)',
                pointerEvents: 'none'
              }}>
                MV SEA PEARL
              </div>

              {/* Coastline Labels */}
              <div style={{ position: 'absolute', top: '28%', left: '22%', zIndex: 1000, color: '#fff', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
                ⚓ Ennore Port
              </div>
              <div style={{ position: 'absolute', bottom: '25%', left: '18%', zIndex: 1000, color: '#fff', fontSize: 11, fontFamily: 'JetBrains Mono', fontWeight: 800 }}>
                Chennai
              </div>

              {/* Coordinates & Scale Overlay */}
              <div style={{
                position: 'absolute', bottom: 8, left: 12, zIndex: 1000,
                background: 'rgba(2, 11, 24, 0.85)', padding: '4px 8px', borderRadius: 4,
                fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)', border: '1px solid var(--border-primary)'
              }}>
                Lat: 13.182° N | Lon: 80.314° E
              </div>

              <div style={{
                position: 'absolute', bottom: 8, right: 12, zIndex: 1000,
                background: 'rgba(2, 11, 24, 0.85)', padding: '4px 8px', borderRadius: 4,
                fontFamily: 'JetBrains Mono', fontSize: 9, color: 'var(--text-muted)', border: '1px solid var(--border-primary)',
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                <span>0  10  20  30  40 km</span>
              </div>
            </div>
          </div>

          {/* B. Vessel Candidates Table (Ranked by Probability) */}
          <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
                VESSEL CANDIDATES (RANKED BY PROBABILITY)
              </span>
              <button style={{
                background: 'rgba(0, 204, 255, 0.1)',
                border: '1px solid var(--accent-cyan-dim)',
                color: 'var(--accent-cyan)',
                padding: '4px 10px',
                borderRadius: 4,
                fontSize: 10,
                fontFamily: 'JetBrains Mono',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                View All Vessels
              </button>
            </div>

            {/* Candidates Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: '0 4px',
                fontFamily: 'JetBrains Mono',
                fontSize: 10
              }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: 8, letterSpacing: '0.08em', textAlign: 'left' }}>
                    <th style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-primary)' }}>#</th>
                    <th style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-primary)' }}>VESSEL NAME</th>
                    <th style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-primary)' }}>IMO</th>
                    <th style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-primary)' }}>TYPE</th>
                    <th style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-primary)' }}>CLOSEST DISTANCE</th>
                    <th style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-primary)' }}>TIME MATCH</th>
                    <th style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-primary)' }}>BEHAVIOR SCORE</th>
                    <th style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-primary)' }}>OVERALL SCORE</th>
                    <th style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-primary)', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {VESSEL_CANDIDATES.map((vessel) => {
                    const isSelected = selectedVessel.id === vessel.id
                    const badgeStyle = getScoreBadgeStyle(vessel.overallScore)

                    return (
                      <tr
                        key={vessel.id}
                        onClick={() => setSelectedVessel(vessel)}
                        style={{
                          background: isSelected ? 'rgba(0, 204, 255, 0.12)' : 'var(--bg-secondary)',
                          border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-primary)',
                          borderRadius: 4,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '8px', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: 700 }}>
                          {vessel.id}
                        </td>
                        <td style={{ padding: '8px', fontWeight: 700, color: isSelected ? 'var(--accent-cyan)' : '#fff' }}>
                          {vessel.name}
                        </td>
                        <td style={{ padding: '8px', color: 'var(--text-muted)' }}>
                          {vessel.imo}
                        </td>
                        <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>
                          {vessel.type}
                        </td>
                        <td style={{ padding: '8px', color: '#fff', fontWeight: 700 }}>
                          {vessel.distance}
                        </td>
                        <td style={{ padding: '8px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                          {vessel.timeMatch}
                        </td>
                        <td style={{ padding: '8px', color: '#fff' }}>
                          {vessel.behaviorScore}
                        </td>
                        <td style={{ padding: '8px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: 3,
                            fontSize: 9,
                            fontWeight: 800,
                            ...badgeStyle
                          }}>
                            {vessel.overallScore}
                          </span>
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedVessel(vessel)
                                showToast(`Targeting ${vessel.name} for radar track reconstruction`)
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', padding: 2 }}
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedVessel(vessel)
                                handleGenerateReport()
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}
                            >
                              <FileText size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* C. AIS Playback Timeline Scrubber (Bottom Strip) */}
          <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
                  AIS PLAYBACK TIMELINE
                </span>
                <span style={{ fontSize: 10, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
                  2025-06-02 03:48:00 UTC
                </span>
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                Jun 01 00:00 ➔ Jun 03 23:59
              </div>
            </div>

            {/* Timeline Scrubber & Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => setTimelineVal(0)}
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: '#fff', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}
                >
                  <RotateCcw size={12} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ background: 'var(--accent-cyan)', border: 'none', color: '#000', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {isPlaying ? <Pause size={12} fill="#000" /> : <Play size={12} fill="#000" />}
                </button>
                <button
                  onClick={() => setPlaybackSpeed(playbackSpeed === '10x' ? '1x' : '10x')}
                  style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--accent-cyan)', borderRadius: 4, padding: '4px 8px', fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 800, cursor: 'pointer' }}
                >
                  {playbackSpeed}
                </button>
              </div>

              {/* Scrubber slider */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={timelineVal}
                  onChange={(e) => setTimelineVal(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                />

                {/* Event Markers along timeline */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
                  <div>
                    <span style={{ color: '#ff3355', fontWeight: 800 }}>• Spill Detected</span>
                    <div style={{ fontSize: 7 }}>Jun 01 10:24</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--accent-cyan)' }}>• Vessel in AOI</span>
                    <div style={{ fontSize: 7 }}>Jun 01 18:12</div>
                  </div>
                  <div>
                    <span style={{ color: '#eab308', fontWeight: 800 }}>• Anomalous Behavior</span>
                    <div style={{ fontSize: 7 }}>Jun 02 03:48</div>
                  </div>
                  <div>
                    <span style={{ color: '#00ff88' }}>• Closest Approach</span>
                    <div style={{ fontSize: 7 }}>Jun 02 04:10</div>
                  </div>
                  <div>
                    <span style={{ color: '#ff3355' }}>• AIS Gap</span>
                    <div style={{ fontSize: 7 }}>Jun 02 06:20</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Vessel Details + Anomaly Graph + Correlation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
          
          {/* A. SELECTED VESSEL DETAILS */}
          <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
                SELECTED VESSEL DETAILS
              </span>
              <span style={{
                background: selectedVessel.status === 'SUSPICIOUS' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                color: selectedVessel.status === 'SUSPICIOUS' ? '#ff3355' : '#f97316',
                border: `1px solid ${selectedVessel.status === 'SUSPICIOUS' ? '#ff3355' : '#f97316'}`,
                padding: '2px 8px', borderRadius: 4, fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 800
              }}>
                {selectedVessel.status}
              </span>
            </div>

            {/* Vessel Image & Info Row */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                width: 90, height: 60, borderRadius: 4, overflow: 'hidden',
                border: '1px solid var(--accent-cyan-dim)', background: '#000', flexShrink: 0
              }}>
                <img src={selectedVessel.image} alt={selectedVessel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 9, fontFamily: 'JetBrains Mono' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {selectedVessel.name}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>IMO: <span style={{ color: '#fff' }}>{selectedVessel.imo}</span></div>
                <div style={{ color: 'var(--text-muted)' }}>MMSI: <span style={{ color: '#fff' }}>{selectedVessel.mmsi}</span></div>
                <div style={{ color: 'var(--text-muted)' }}>Type: <span style={{ color: '#fff' }}>{selectedVessel.type}</span></div>
                <div style={{ color: 'var(--text-muted)' }}>Flag: <span style={{ color: '#fff' }}>{selectedVessel.flag}</span></div>
              </div>
            </div>

            {/* Dossier Sub-Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)', gap: 4, marginTop: 4 }}>
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'trajectory', label: 'Trajectory' },
                { id: 'behavior', label: 'Behavior' },
                { id: 'gaps', label: 'AIS Gaps' },
                { id: 'events', label: 'Events' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDossierTab(tab.id as any)}
                  style={{
                    padding: '4px 8px',
                    fontSize: 9,
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 700,
                    border: 'none',
                    background: 'transparent',
                    color: activeDossierTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    borderBottom: activeDossierTab === tab.id ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Vessel Metadata List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 9, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Last Known Position</span>
                <span style={{ color: '#fff' }}>{selectedVessel.lastPos}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Speed</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{selectedVessel.speed}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Course</span>
                <span style={{ color: '#fff' }}>{selectedVessel.course}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Last AIS Signal</span>
                <span style={{ color: 'var(--accent-cyan)' }}>{selectedVessel.lastSignal}</span>
              </div>
            </div>
          </div>

          {/* B. ANOMALY ANALYSIS GRAPH */}
          <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
                ANOMALY ANALYSIS
              </span>
              <div style={{ display: 'flex', gap: 8, fontSize: 8, fontFamily: 'JetBrains Mono' }}>
                <span style={{ color: 'var(--accent-cyan)' }}>● Speed (kn)</span>
                <span style={{ color: '#00ff88' }}>● Course (°)</span>
                <span style={{ color: '#ff3355' }}>■ Anomaly</span>
              </div>
            </div>

            {/* Custom SVG Speed/Course Graph with Red Shaded Anomaly Box */}
            <div style={{ position: 'relative', height: 110, width: '100%', background: '#020b18', borderRadius: 4, border: '1px solid var(--border-primary)' }}>
              <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="25" x2="300" y2="25" stroke="#0f2942" strokeDasharray="2 2" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="#0f2942" strokeDasharray="2 2" />
                <line x1="0" y1="75" x2="300" y2="75" stroke="#0f2942" strokeDasharray="2 2" />

                {/* Red Anomaly Box Shading */}
                <rect x="140" y="10" width="80" height="80" fill="rgba(255, 51, 85, 0.18)" stroke="#ff3355" strokeDasharray="2 2" />
                <text x="180" y="25" fill="#ff3355" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                  Speed Drop + Loitering
                </text>

                {/* Speed Line (Cyan) */}
                <path
                  d="M 0 30 Q 50 25, 100 35 T 140 30 L 150 85 L 210 80 L 220 30 T 300 35"
                  fill="none"
                  stroke="#00ccff"
                  strokeWidth="1.5"
                />

                {/* Course Line (Green) */}
                <path
                  d="M 0 50 Q 70 45, 120 50 T 150 55 L 170 70 L 210 65 L 230 45 T 300 50"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
              </svg>

              {/* X Axis Time Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', fontSize: 7, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', marginTop: -12 }}>
                <span>Jun 01</span>
                <span>Jun 01 12:00</span>
                <span>Jun 02</span>
                <span>Jun 02 12:00</span>
                <span>Jun 03</span>
              </div>
            </div>
          </div>

          {/* C. CORRELATION WITH SPILL */}
          <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
              CORRELATION WITH SPILL
            </span>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {/* Donut Score Meter */}
              <div style={{ position: 'relative', width: 85, height: 85, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="85" height="85" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-secondary)" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="#00ccff"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - selectedVessel.overallScore / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono', lineHeight: 1 }}>
                    {selectedVessel.overallScore}%
                  </div>
                  <div style={{ fontSize: 7, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', marginTop: 2 }}>
                    Temporal & Spatial Match
                  </div>
                </div>
              </div>

              {/* Correlation Details Grid */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 9, fontFamily: 'JetBrains Mono' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Closest Approach</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{selectedVessel.distance}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Time Difference</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>38 minutes</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>In Drift Path</span>
                  <span style={{ color: '#00ff88', fontWeight: 700 }}>Yes (92% Match)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Confidence</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>High</span>
                </div>
              </div>
            </div>

            {/* Action Button: Generate Investigation Report */}
            <button
              onClick={handleGenerateReport}
              style={{
                background: '#00ccff',
                color: '#000',
                border: 'none',
                borderRadius: 6,
                padding: '9px',
                fontSize: 11,
                fontWeight: 800,
                fontFamily: 'JetBrains Mono',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                marginTop: 4,
                boxShadow: '0 0 12px rgba(0, 204, 255, 0.3)'
              }}
            >
              <FileText size={13} fill="#000" /> Generate Investigation Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
