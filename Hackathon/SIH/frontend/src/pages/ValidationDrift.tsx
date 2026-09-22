import { useState } from 'react'
import {
  RotateCw,
  Calendar,
  ShieldCheck,
  Droplet,
  Wind,
  Target,
  Clock,
  AlertTriangle,
  Info,
  ChevronDown,
  Compass,
  Thermometer,
  Cloud,
  Check,
  Search,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Sliders,
  Maximize2,
  X,
  Play,
  Pause
} from 'lucide-react'
import MapView from '../components/MapView'
import { SAR_SEGMENTED_IMAGES, type SarSegmentedImage } from '../utils/sarImages'

export default function ValidationDrift() {
  const [selectedSpillIdx, setSelectedSpillIdx] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'simulation' | 'env' | 'results' | 'whatif'>('overview')
  const [activeHorizon, setActiveHorizon] = useState<'live' | '24h' | '48h' | '72h' | '7d'>('48h')
  const [rightPanelTab, setRightPanelTab] = useState<'trajectory' | 'impact'>('trajectory')
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0)
  const [recomputing, setRecomputing] = useState(false)
  const [showNotification, setShowNotification] = useState<string | null>(null)
  
  // Date range picker modal state
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState('2025-06-01 00:00 → 2025-06-03 23:59')
  
  // Frame preview modal state
  const [previewFrame, setPreviewFrame] = useState<{ label: string; path: string; desc: string } | null>(null)

  // Map Zoom State
  const [mapZoom, setMapZoom] = useState(11)

  // Interactive What-If Parameters state
  const [whatIfParams, setWhatIfParams] = useState({
    windSpeed: 14, // knots
    windDir: 45, // degrees NE
    currentSpeed: 0.3, // m/s
    spillVolume: 12.36, // km²
    decayRate: 2.1 // %/day
  })

  // Simulation controls state
  const [isPlaying, setIsPlaying] = useState(false)
  const [simHour, setSimHour] = useState(48)

  const [mapLayers, setMapLayers] = useState({
    satellite: true,
    detectedSpill: true,
    drift24h: true,
    drift48h: true,
    drift72h: true,
    uncertaintyCone: true,
    vesselTracks: true,
    coastlinePorts: true,
    environmentalVectors: true,
    protectedAreas: false
  })

  const currentSpill: SarSegmentedImage = SAR_SEGMENTED_IMAGES[selectedSpillIdx] || SAR_SEGMENTED_IMAGES[0]

  const triggerToast = (msg: string) => {
    setShowNotification(msg)
    setTimeout(() => {
      setShowNotification(null)
    }, 3500)
  }

  const handleRecompute = () => {
    setRecomputing(true)
    setTimeout(() => {
      setRecomputing(false)
      triggerToast('✓ Drift trajectory model recomputed using real-time NOAA GNOME & Copernicus surface vectors!')
    }, 1200)
  }

  const toggleLayer = (layerKey: keyof typeof mapLayers) => {
    setMapLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }))
  }

  const handleZoomIn = () => setMapZoom(prev => Math.min(prev + 1, 16))
  const handleZoomOut = () => setMapZoom(prev => Math.max(prev - 1, 8))
  const handleRecenter = () => {
    setMapZoom(11)
    triggerToast('Map view recentered to slick centroid')
  }

  // Calculated horizons based on What-If parameters
  const calcDist24 = (12.4 * (whatIfParams.windSpeed / 14)).toFixed(1)
  const calcDist48 = (28.7 * (whatIfParams.windSpeed / 14)).toFixed(1)
  const calcDist72 = (46.1 * (whatIfParams.windSpeed / 14)).toFixed(1)

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
      gap: '14px',
      position: 'relative'
    }}>

      {/* Floating Notification Toast */}
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          background: 'rgba(2, 17, 34, 0.95)',
          border: '1px solid #00ccff',
          color: '#fff',
          padding: '10px 16px',
          borderRadius: 6,
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          boxShadow: '0 0 20px rgba(0, 204, 255, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          animation: 'fadeIn 0.2s ease-in-out'
        }}>
          <Check size={14} color="#00ff88" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Frame Preview Modal */}
      {previewFrame && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9990,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20
        }}>
          <div style={{
            background: '#020d1a',
            border: '1px solid var(--accent-cyan)',
            borderRadius: 8,
            maxWidth: 680,
            width: '100%',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            boxShadow: '0 0 30px rgba(0, 204, 255, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono' }}>
                {previewFrame.label} — Satellite High Resolution Frame
              </div>
              <button
                onClick={() => setPreviewFrame(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ width: '100%', height: 320, borderRadius: 6, overflow: 'hidden', background: '#000' }}>
              <img src={previewFrame.path} alt={previewFrame.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', margin: 0 }}>
              {previewFrame.desc}
            </p>
          </div>
        </div>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9990,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#020d1a',
            border: '1px solid var(--accent-cyan)',
            borderRadius: 8,
            padding: 20,
            width: 380,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            boxShadow: '0 0 25px rgba(0, 204, 255, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono' }}>
                Select Analysis Date Window
              </span>
              <button onClick={() => setShowDatePicker(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'JetBrains Mono', fontSize: 11 }}>
              {[
                '2025-06-01 00:00 → 2025-06-03 23:59',
                '2025-06-04 00:00 → 2025-06-06 23:59',
                '2025-06-07 00:00 → 2025-06-09 23:59',
                '2025-06-10 00:00 → 2025-06-12 23:59'
              ].map((range, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDateRange(range)
                    setShowDatePicker(false)
                    triggerToast(`Date range set to ${range}`)
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 4,
                    background: dateRange === range ? 'rgba(0, 204, 255, 0.2)' : 'rgba(255,255,255,0.03)',
                    border: dateRange === range ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.1)',
                    color: dateRange === range ? 'var(--accent-cyan)' : '#e2e8f0',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 1. Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', marginBottom: 2 }}>
            Home &gt; <span style={{ color: 'var(--accent-cyan)' }}>Validation &amp; Drift</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Validation &amp; Drift
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>
              Verify detected slicks, analyze environment and predict movement
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
            Combine satellite analysis with environmental data to validate oil spills and simulate drift trajectory.
          </p>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Spill Switcher Dropdown */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, color: 'var(--accent-cyan)' }} />
            <select
              value={selectedSpillIdx}
              onChange={(e) => {
                const idx = Number(e.target.value)
                setSelectedSpillIdx(idx)
                triggerToast(`Loaded ${SAR_SEGMENTED_IMAGES[idx].spillNo} dataset`)
              }}
              style={{
                background: 'rgba(4, 21, 37, 0.9)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: 6,
                padding: '6px 24px 6px 30px',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--accent-cyan)',
                fontFamily: 'JetBrains Mono',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 0 10px rgba(0, 204, 255, 0.2)'
              }}
            >
              {SAR_SEGMENTED_IMAGES.map((img, idx) => (
                <option key={img.id} value={idx} style={{ background: '#020b18', color: '#fff' }}>
                  {img.spillNo} ({img.date} - {img.placeOfSpill.split('(')[0].trim()})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker Button */}
          <button
            onClick={() => setShowDatePicker(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 11,
              fontFamily: 'JetBrains Mono',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <Calendar size={13} color="var(--accent-cyan)" />
            <span>{dateRange}</span>
            <ChevronDown size={12} color="var(--text-muted)" />
          </button>

          {/* Recompute Drift Button */}
          <button
            onClick={handleRecompute}
            disabled={recomputing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#00ccff',
              color: '#000',
              border: 'none',
              borderRadius: 6,
              padding: '7px 16px',
              fontSize: 11,
              fontWeight: 800,
              fontFamily: 'JetBrains Mono',
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(0, 204, 255, 0.4)'
            }}
          >
            <RotateCw size={13} className={recomputing ? 'animate-spin' : ''} />
            {recomputing ? 'Recomputing...' : 'Recompute Drift'}
          </button>
        </div>
      </div>

      {/* 2. Navigation Sub-Tabs Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        borderBottom: '1px solid var(--border-primary)',
        paddingBottom: '2px',
        flexShrink: 0
      }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'simulation', label: 'Drift Simulation' },
          { id: 'env', label: 'Environmental Data' },
          { id: 'results', label: 'Validation Results' },
          { id: 'whatif', label: 'What-If Analysis' },
        ].map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any)
                triggerToast(`Switched to ${tab.label} tab view`)
              }}
              style={{
                padding: '6px 16px',
                borderRadius: '4px 4px 0 0',
                fontSize: 11,
                fontFamily: 'JetBrains Mono',
                fontWeight: isActive ? 800 : 600,
                background: isActive ? 'rgba(0, 204, 255, 0.15)' : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Conditional Content for Navigation Tabs */}
      {activeTab === 'simulation' && (
        <div className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>
            Interactive Hydrodynamic Drift Simulation Scrubber
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: '#00ccff',
                color: '#000',
                border: 'none',
                borderRadius: 4,
                padding: '6px 14px',
                fontSize: 11,
                fontWeight: 800,
                fontFamily: 'JetBrains Mono',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'PAUSE SIMULATION' : 'PLAY DRIFT TIMELINE'}
            </button>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#fff' }}>T+{simHour} Hours</span>
              <input
                type="range"
                min="0"
                max="72"
                value={simHour}
                onChange={(e) => setSimHour(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'whatif' && (
        <div className="glass-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sliders size={14} /> What-If Scenario Parameter Tuning
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, fontFamily: 'JetBrains Mono', fontSize: 11 }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 4 }}>
                Wind Speed: <strong style={{ color: '#fff' }}>{whatIfParams.windSpeed} kts</strong>
              </label>
              <input
                type="range"
                min="5"
                max="35"
                value={whatIfParams.windSpeed}
                onChange={(e) => setWhatIfParams(p => ({ ...p, windSpeed: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 4 }}>
                Wind Direction: <strong style={{ color: '#fff' }}>{whatIfParams.windDir}° (NE)</strong>
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={whatIfParams.windDir}
                onChange={(e) => setWhatIfParams(p => ({ ...p, windDir: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 4 }}>
                Ocean Current: <strong style={{ color: '#fff' }}>{whatIfParams.currentSpeed} m/s</strong>
              </label>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.1"
                value={whatIfParams.currentSpeed}
                onChange={(e) => setWhatIfParams(p => ({ ...p, currentSpeed: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: 4 }}>
                Spill Volume: <strong style={{ color: '#fff' }}>{whatIfParams.spillVolume} km²</strong>
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={whatIfParams.spillVolume}
                onChange={(e) => setWhatIfParams(p => ({ ...p, spillVolume: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Top Metrics Row (5 KPI Cards) matching screenshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', flexShrink: 0 }}>
        {/* Card 1: Spill Area */}
        <div className="glass-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(0, 204, 255, 0.1)', padding: 10, borderRadius: 8, border: '1px solid var(--accent-cyan-dim)' }}>
            <Droplet size={18} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
              SPILL AREA
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono' }}>
                {activeTab === 'whatif' ? whatIfParams.spillVolume : currentSpill.slickAreaKm2} km²
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#00ff88', fontFamily: 'JetBrains Mono' }}>
                ↑ 12%
              </span>
            </div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>From last analysis</div>
          </div>
        </div>

        {/* Card 2: Confidence */}
        <div className="glass-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(0, 204, 255, 0.1)', padding: 10, borderRadius: 8, border: '1px solid var(--accent-cyan-dim)' }}>
            <ShieldCheck size={18} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
              CONFIDENCE
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono', marginTop: 2 }}>
              {currentSpill.confidence}%
            </div>
            <div style={{ fontSize: 8, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
              Likely Oil Spill
            </div>
          </div>
        </div>

        {/* Card 3: Drift Speed */}
        <div className="glass-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(0, 204, 255, 0.1)', padding: 10, borderRadius: 8, border: '1px solid var(--accent-cyan-dim)' }}>
            <Wind size={18} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
              DRIFT SPEED (AVG)
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono', marginTop: 2 }}>
              {(1.4 * (whatIfParams.windSpeed / 14)).toFixed(1)} knots
            </div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>NE @ 045°</div>
          </div>
        </div>

        {/* Card 4: Predicted Impact */}
        <div className="glass-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(0, 204, 255, 0.1)', padding: 10, borderRadius: 8, border: '1px solid var(--accent-cyan-dim)' }}>
            <Target size={18} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
              PREDICTED IMPACT
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono', marginTop: 2 }}>
              {calcDist48} km
            </div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>Coastline (in 48h)</div>
          </div>
        </div>

        {/* Card 5: Time to Coast */}
        <div className="glass-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(0, 204, 255, 0.1)', padding: 10, borderRadius: 8, border: '1px solid var(--accent-cyan-dim)' }}>
            <Clock size={18} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
              TIME TO COAST
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono', marginTop: 2 }}>
              34 hours
            </div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>Estimated arrival</div>
          </div>
        </div>
      </div>

      {/* 4. Main Middle Split Grid: Map & Right Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '12px', flex: 1, minHeight: 360 }}>
        
        {/* Left Column: SPILL VALIDATION & DRIFT PREDICTION MAP */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
          
          {/* Map Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
              SPILL VALIDATION &amp; DRIFT PREDICTION MAP
            </span>

            {/* Time Horizon Toggles */}
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: 2, borderRadius: 4, border: '1px solid var(--border-primary)' }}>
              {[
                { id: 'live', label: '● Live' },
                { id: '24h', label: '24h' },
                { id: '48h', label: '48h' },
                { id: '72h', label: '72h' },
                { id: '7d', label: '7d' },
              ].map(h => (
                <button
                  key={h.id}
                  onClick={() => {
                    setActiveHorizon(h.id as any)
                    triggerToast(`Active horizon filtered to ${h.label}`)
                  }}
                  style={{
                    padding: '3px 8px',
                    fontSize: 9,
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 700,
                    borderRadius: 3,
                    border: 'none',
                    background: activeHorizon === h.id ? '#00ccff' : 'transparent',
                    color: activeHorizon === h.id ? '#000' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Map View Container */}
          <div style={{ flex: 1, minHeight: 320, borderRadius: 6, overflow: 'hidden', position: 'relative', border: '1px solid var(--border-primary)' }}>
            <MapView
              center={[currentSpill.coordinates.lat, currentSpill.coordinates.lon]}
              zoom={mapZoom}
              layers={mapLayers}
              activeHorizon={activeHorizon}
              spillData={currentSpill}
            />

            {/* Map Controls Floating Bar (Top Right below Legend or Right Side) */}
            <div style={{
              position: 'absolute', top: 12, right: 180, zIndex: 1000,
              display: 'flex', flexDirection: 'column', gap: 4
            }}>
              <button
                onClick={handleZoomIn}
                title="Zoom In"
                style={{
                  background: 'rgba(2, 11, 24, 0.9)', border: '1px solid var(--border-primary)',
                  color: '#fff', padding: 6, borderRadius: 4, cursor: 'pointer'
                }}
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={handleZoomOut}
                title="Zoom Out"
                style={{
                  background: 'rgba(2, 11, 24, 0.9)', border: '1px solid var(--border-primary)',
                  color: '#fff', padding: 6, borderRadius: 4, cursor: 'pointer'
                }}
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={handleRecenter}
                title="Recenter Map"
                style={{
                  background: 'rgba(2, 11, 24, 0.9)', border: '1px solid var(--border-primary)',
                  color: 'var(--accent-cyan)', padding: 6, borderRadius: 4, cursor: 'pointer'
                }}
              >
                <Crosshair size={14} />
              </button>
            </div>

            {/* Map Layers Checkbox Overlay Box (Top Left of Map) matching screenshot */}
            <div style={{
              position: 'absolute', top: 10, left: 10, zIndex: 1000,
              background: 'rgba(2, 11, 24, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-primary)',
              borderRadius: 6,
              padding: '8px 12px',
              fontFamily: 'JetBrains Mono',
              fontSize: 9,
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#fff', marginBottom: 2 }}>Map Layers</div>
              {(Object.keys(mapLayers) as Array<keyof typeof mapLayers>).map(layerKey => (
                <label key={layerKey} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: mapLayers[layerKey] ? '#fff' : 'var(--text-muted)' }}>
                  <input
                    type="checkbox"
                    checked={mapLayers[layerKey]}
                    onChange={() => toggleLayer(layerKey)}
                    style={{ accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                  />
                  <span>
                    {layerKey === 'satellite' && 'Satellite Imagery'}
                    {layerKey === 'detectedSpill' && 'Detected Spill (Current)'}
                    {layerKey === 'drift24h' && 'Drift Prediction (24h)'}
                    {layerKey === 'drift48h' && 'Drift Prediction (48h)'}
                    {layerKey === 'drift72h' && 'Drift Prediction (72h)'}
                    {layerKey === 'uncertaintyCone' && 'Uncertainty Cone'}
                    {layerKey === 'vesselTracks' && 'Vessel Tracks (AIS)'}
                    {layerKey === 'coastlinePorts' && 'Coastline & Ports'}
                    {layerKey === 'environmentalVectors' && 'Environmental Vectors'}
                    {layerKey === 'protectedAreas' && 'Protected Areas'}
                  </span>
                </label>
              ))}
            </div>

            {/* Map Trajectory Legend Box (Top Right of Map) matching screenshot */}
            <div style={{
              position: 'absolute', top: 10, right: 10, zIndex: 1000,
              background: 'rgba(2, 11, 24, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-primary)',
              borderRadius: 6,
              padding: '8px 12px',
              fontFamily: 'JetBrains Mono',
              fontSize: 9,
              display: 'flex',
              flexDirection: 'column',
              gap: 4
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 8, background: '#ff3355', borderRadius: 2 }} />
                <span style={{ color: '#fff' }}>Current Spill</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, borderTop: '2px dashed #ff3355' }} />
                <span style={{ color: 'var(--text-muted)' }}>24h Drift</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, borderTop: '2px dashed #f97316' }} />
                <span style={{ color: 'var(--text-muted)' }}>48h Drift</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, borderTop: '2px dashed #eab308' }} />
                <span style={{ color: 'var(--text-muted)' }}>72h Drift</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, borderTop: '1px dashed #64748b' }} />
                <span style={{ color: 'var(--text-muted)' }}>Uncertainty Cone</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, background: '#00ff88', borderRadius: '50%' }} />
                <span style={{ color: '#00ff88' }}>Vessel (AIS)</span>
              </div>
            </div>

            {/* Scale Bar Indicator (Bottom Right) */}
            <div style={{
              position: 'absolute', bottom: 10, right: 10, zIndex: 1000,
              background: 'rgba(2, 11, 24, 0.85)',
              padding: '2px 8px', borderRadius: 3,
              fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', border: '1px solid var(--border-primary)',
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <span>0</span>
              <span style={{ width: 30, height: 2, background: '#fff', display: 'inline-block' }} />
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40 km</span>
            </div>

            {/* Bottom Coordinate Overlay matching screenshot */}
            <div style={{
              position: 'absolute', bottom: 8, left: 10, zIndex: 1000,
              background: 'rgba(2, 11, 24, 0.85)',
              padding: '2px 8px', borderRadius: 3,
              fontSize: 9, color: '#fff', fontFamily: 'JetBrains Mono', border: '1px solid var(--border-primary)'
            }}>
              {currentSpill.coordinates.lat}° N, {currentSpill.coordinates.lon}° E
            </div>
          </div>
        </div>

        {/* Right Column: Environmental, Drift Prediction & Confidence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Card A: ENVIRONMENTAL CONDITIONS matching screenshot */}
          <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
                ENVIRONMENTAL CONDITIONS
              </span>
              <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                2025-06-02 12:00 UTC
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontFamily: 'JetBrains Mono', fontSize: 9 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '6px 8px', borderRadius: 4 }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Wind size={12} color="var(--accent-cyan)" /> Wind Speed
                </span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{whatIfParams.windSpeed} knots</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '6px 8px', borderRadius: 4 }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Compass size={12} color="var(--accent-cyan)" /> Wind Direction
                </span>
                <span style={{ color: '#fff', fontWeight: 700 }}>NE ({whatIfParams.windDir}°)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '6px 8px', borderRadius: 4 }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Compass size={12} color="var(--accent-cyan)" /> Wave Height
                </span>
                <span style={{ color: '#fff', fontWeight: 700 }}>1.2 m</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '6px 8px', borderRadius: 4 }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Wind size={12} color="var(--accent-cyan)" /> Ocean Current
                </span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{whatIfParams.currentSpeed} m/s (NE)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '6px 8px', borderRadius: 4 }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Thermometer size={12} color="var(--accent-cyan)" /> Sea Surface Temp
                </span>
                <span style={{ color: '#fff', fontWeight: 700 }}>28.5 °C</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '6px 8px', borderRadius: 4 }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Cloud size={12} color="var(--accent-cyan)" /> Weather Condition
                </span>
                <span style={{ color: '#00ff88', fontWeight: 700 }}>Clear</span>
              </div>
            </div>
          </div>

          {/* Card B: DRIFT PREDICTION DETAILS matching screenshot */}
          <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
                DRIFT PREDICTION DETAILS
              </span>
              
              {/* Right Panel Sub Tabs */}
              <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 4, padding: 2 }}>
                <button
                  onClick={() => setRightPanelTab('trajectory')}
                  style={{
                    background: rightPanelTab === 'trajectory' ? 'var(--accent-cyan)' : 'transparent',
                    color: rightPanelTab === 'trajectory' ? '#000' : 'var(--text-muted)',
                    border: 'none', borderRadius: 3, padding: '2px 8px', fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Trajectory
                </button>
                <button
                  onClick={() => setRightPanelTab('impact')}
                  style={{
                    background: rightPanelTab === 'impact' ? 'var(--accent-cyan)' : 'transparent',
                    color: rightPanelTab === 'impact' ? '#000' : 'var(--text-muted)',
                    border: 'none', borderRadius: 3, padding: '2px 8px', fontSize: 9, fontFamily: 'JetBrains Mono', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Impact Analysis
                </button>
              </div>
            </div>

            {rightPanelTab === 'trajectory' ? (
              /* Trajectory Table matching screenshot */
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'JetBrains Mono', fontSize: 9 }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: 8, borderBottom: '1px solid var(--border-primary)', textAlign: 'left' }}>
                    <th style={{ padding: '4px 6px' }}>HORIZON</th>
                    <th style={{ padding: '4px 6px' }}>DISTANCE</th>
                    <th style={{ padding: '4px 6px' }}>DIRECTION</th>
                    <th style={{ padding: '4px 6px' }}>EST. POSITION</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { horizon: 'Current', distance: '-', direction: '-', pos: `${currentSpill.coordinates.lat}° N, ${currentSpill.coordinates.lon}° E` },
                    { horizon: '24 hours', distance: `${calcDist24} km`, direction: '62° (ENE)', pos: '13.215° N, 80.452° E' },
                    { horizon: '48 hours', distance: `${calcDist48} km`, direction: '68° (ENE)', pos: '13.268° N, 80.621° E' },
                    { horizon: '72 hours', distance: `${calcDist72} km`, direction: '71° (ENE)', pos: '13.324° N, 80.812° E' },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '5px 6px', color: '#fff', fontWeight: 700 }}>{row.horizon}</td>
                      <td style={{ padding: '5px 6px', color: 'var(--accent-cyan)' }}>{row.distance}</td>
                      <td style={{ padding: '5px 6px', color: 'var(--text-secondary)' }}>{row.direction}</td>
                      <td style={{ padding: '5px 6px', color: 'var(--text-muted)' }}>{row.pos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* Impact Analysis View */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'JetBrains Mono', fontSize: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Coastal Vulnerability Index:</span>
                  <span style={{ color: '#ff3355', fontWeight: 800 }}>HIGH (Class V)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Sensitive Ecosystems:</span>
                  <span style={{ color: '#f97316', fontWeight: 700 }}>Pulicat Estuary &amp; Mangroves</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', background: 'rgba(255,255,255,0.03)', borderRadius: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Est. Arrival Window:</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>T+34 Hours to T+42 Hours</span>
                </div>
              </div>
            )}

            {/* Alert Coastal Impact Callout Box matching screenshot */}
            <div style={{
              background: 'rgba(249, 115, 22, 0.1)',
              border: '1px solid #f97316',
              borderRadius: 4,
              padding: '8px 10px',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
              marginTop: 4
            }}>
              <AlertTriangle size={16} color="#f97316" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#f97316', fontFamily: 'JetBrains Mono' }}>
                  Potential Coastal Impact
                </div>
                <div style={{ fontSize: 8, color: '#fff', fontFamily: 'JetBrains Mono', marginTop: 2 }}>
                  The spill is likely to reach the coastline within 34 hours.
                </div>
                <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                  Affected area: North Chennai coast.
                </div>
              </div>
            </div>
          </div>

          {/* Card C: CONFIDENCE ANALYSIS matching screenshot */}
          <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
                CONFIDENCE ANALYSIS
              </span>
              <button
                onClick={() => triggerToast('Model confidence based on Sentinel SAR backscatter ratio & wind damping')}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <Info size={13} color="var(--accent-cyan)" />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '4px 0' }}>
              {/* Circular Gauge / Donut */}
              <div style={{
                position: 'relative',
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: 'conic-gradient(#00ff88 0% 91%, #f97316 91% 97%, #eab308 97% 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: '#020b18',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color: '#fff', fontFamily: 'JetBrains Mono' }}>
                    {currentSpill.confidence}%
                  </span>
                  <span style={{ fontSize: 7, color: '#00ff88', fontFamily: 'JetBrains Mono' }}>Likely Oil</span>
                </div>
              </div>

              {/* Legend List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'JetBrains Mono', fontSize: 9 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88' }} />
                  <span style={{ color: '#fff' }}>Oil Spill</span>
                  <span style={{ color: '#00ff88', fontWeight: 800, marginLeft: 'auto' }}>{currentSpill.confidence}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f97316' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Look-alike (Low Wind)</span>
                  <span style={{ color: '#f97316', fontWeight: 700, marginLeft: 'auto' }}>6%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#eab308' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Other (Biological)</span>
                  <span style={{ color: '#eab308', fontWeight: 700, marginLeft: 'auto' }}>3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Row: SATELLITE FRAMES (VALIDATION VIEW) matching screenshot */}
      <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
            SATELLITE FRAMES (VALIDATION VIEW)
          </span>
          <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
            Click frame to inspect full resolution satellite image
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
          {[
            { label: 'Original (SAR)', path: currentSpill.path, type: 'original', desc: 'Sentinel-1 C-SAR IW Mode original amplitude imagery.' },
            { label: 'Detected Spill', path: currentSpill.path, type: 'mask', desc: 'Deep learning UNet segmentation slick binary mask.' },
            { label: 'Validation Overlay', path: currentSpill.path, type: 'overlay', desc: 'Combined multi-spectral SAR validation overlay.' },
            { label: '24h Drift', path: currentSpill.path, type: 'drift24', desc: '24-hour forecasted slick displacement geometry.' },
            { label: '48h Drift', path: currentSpill.path, type: 'drift48', desc: '48-hour forecasted slick displacement geometry.' },
            { label: '72h Drift', path: currentSpill.path, type: 'drift72', desc: '72-hour forecasted slick displacement geometry.' },
          ].map((frame, idx) => {
            const isSelected = activeFrameIndex === idx
            return (
              <div
                key={idx}
                onClick={() => {
                  setActiveFrameIndex(idx)
                  setPreviewFrame({ label: frame.label, path: frame.path, desc: frame.desc })
                }}
                style={{
                  border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-primary)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: '#000',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 12px rgba(0, 204, 255, 0.4)' : 'none',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                <div style={{ height: 70, position: 'relative' }}>
                  <img
                    src={frame.path}
                    alt={frame.label}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: frame.type === 'original' ? 'grayscale(100%)' : 'none'
                    }}
                  />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(2, 11, 24, 0.88)',
                    color: isSelected ? 'var(--accent-cyan)' : '#fff',
                    fontSize: 8,
                    fontWeight: 700,
                    padding: '2px 4px',
                    fontFamily: 'JetBrains Mono',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3
                  }}>
                    <span>{frame.label}</span>
                    <Maximize2 size={8} color="var(--accent-cyan)" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
