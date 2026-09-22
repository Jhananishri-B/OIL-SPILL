import { useState } from 'react'
import {
  Play,
  AlertTriangle,
  Search,
  Calendar,
  MapPin,
  Layers,
  Info,
  Check,
  ShieldCheck,
  Activity,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react'
import MapView from '../components/MapView'
import { SAR_SEGMENTED_IMAGES, type SarSegmentedImage } from '../utils/sarImages'

export default function SatelliteDetection() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<'overview' | 'model' | 'env' | 'metadata'>('overview')
  const [mapLayers, setMapLayers] = useState({
    basemap: true,
    spillPolygon: true,
    centroid: true,
    vesselTracks: true,
    predictedDrift: true,
    coastline: false,
    ports: false
  })
  const [dateRange] = useState('2026-08-27 — 2026-09-22')

  // Selected image object from dataset
  const currentImage: SarSegmentedImage = SAR_SEGMENTED_IMAGES[selectedImageIndex] || SAR_SEGMENTED_IMAGES[0]

  const toggleLayer = (layerKey: keyof typeof mapLayers) => {
    setMapLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }))
  }

  return (
    <div style={{
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      height: '100%',
      overflowY: 'auto',
      background: '#010a15',
      color: '#e2e8f0',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* 1. Header & Search / Select Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', marginBottom: 2 }}>
            Home &gt; <span style={{ color: 'var(--accent-cyan)' }}>Satellite Detection</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Satellite Detection
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>
              Autonomous Slick Identification & SAR Segmentation
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              • Process Sentinel-1 SAR imagery with AI to detect potential oil spills in near real-time.
            </span>
          </div>
        </div>

        {/* Right Header Action & Spill Selector Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Spill Search & Select Dropdown */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, color: 'var(--accent-cyan)' }} />
            <select
              value={selectedImageIndex}
              onChange={(e) => setSelectedImageIndex(Number(e.target.value))}
              style={{
                background: 'rgba(4, 21, 37, 0.9)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: 6,
                padding: '6px 28px 6px 30px',
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
                  {img.spillNo} ({img.date} - {img.placeOfSpill.split('(')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: 11,
            fontFamily: 'JetBrains Mono',
            color: 'var(--text-secondary)'
          }}>
            <Calendar size={13} color="var(--text-muted)" />
            <span>{dateRange}</span>
            <ChevronDown size={12} color="var(--text-muted)" />
          </div>

          {/* Run Detection Button */}
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#00ccff',
            color: '#000',
            border: 'none',
            borderRadius: 6,
            padding: '7px 16px',
            fontSize: 12,
            fontWeight: 800,
            fontFamily: 'JetBrains Mono',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(0, 204, 255, 0.4)'
          }}>
            <Play size={13} fill="#000" /> Run Detection
          </button>
        </div>
      </div>

      {/* 2. Top Row: 4 Sequential Pipeline Stage Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        
        {/* CARD 01: SAR ACQUISITION */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 900, fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)' }}>01</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
                  SAR ACQUISITION
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Sentinel-1 VV/VH Imagery</div>
              </div>
            </div>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#00ff8822', border: '1px solid #00ff88', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={10} color="#00ff88" />
            </div>
          </div>

          {/* Split VV & VH Image View */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', height: 115 }}>
            <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-primary)', background: '#000' }}>
              <img src={currentImage.path} alt="VV Polarization" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) brightness(0.9)' }} />
              <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.75)', fontSize: 8, fontFamily: 'JetBrains Mono', padding: '1px 4px', borderRadius: 2, color: '#fff' }}>
                VV Polarization
              </div>
            </div>
            <div style={{ position: 'relative', borderRadius: 4, overflow: 'hidden', border: '1px solid var(--border-primary)', background: '#000' }}>
              <img src={currentImage.path} alt="VH Polarization" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(140%)' }} />
              <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.75)', fontSize: 8, fontFamily: 'JetBrains Mono', padding: '1px 4px', borderRadius: 2, color: '#fff' }}>
                VH Polarization
              </div>
            </div>
          </div>

          {/* Sub Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 9, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Satellite</span>
              <span style={{ color: '#fff' }}>{currentImage.sensor}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Acquisition</span>
              <span style={{ color: '#fff' }}>{currentImage.date} {currentImage.timeAmPm}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Product Type</span>
              <span style={{ color: 'var(--accent-cyan)' }}>IW_GRDH_1S</span>
            </div>
          </div>
        </div>

        {/* CARD 02: AI SEGMENTATION */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 900, fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)' }}>02</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
                  AI SEGMENTATION
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>U-Net (Oil Spill Detection)</div>
              </div>
            </div>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#00ff8822', border: '1px solid #00ff88', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={10} color="#00ff88" />
            </div>
          </div>

          {/* AI Segmented Image */}
          <div style={{ position: 'relative', height: 115, borderRadius: 4, overflow: 'hidden', border: '1px solid var(--accent-cyan-dim)', background: '#000' }}>
            <img src={currentImage.path} alt="AI Segmentation" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            
            {/* Overlay legend */}
            <div style={{
              position: 'absolute', top: 6, right: 6,
              background: 'rgba(2, 11, 24, 0.85)', border: '1px solid var(--border-primary)',
              borderRadius: 3, padding: '3px 6px', fontSize: 8, fontFamily: 'JetBrains Mono',
              display: 'flex', flexDirection: 'column', gap: 2
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, background: '#ff3355', borderRadius: 1 }} />
                <span style={{ color: '#fff' }}>Detected Spill</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, background: '#64748b', borderRadius: 1 }} />
                <span style={{ color: 'var(--text-muted)' }}>Background</span>
              </div>
            </div>

            {/* Gauge overlay */}
            <div style={{
              position: 'absolute', bottom: 6, left: 6, right: 6,
              background: 'rgba(2, 11, 24, 0.85)', padding: '4px 6px', borderRadius: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              border: '1px solid var(--accent-cyan-dim)'
            }}>
              <span style={{ fontSize: 8, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>Model Confidence</span>
              <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', fontWeight: 800, color: 'var(--accent-cyan)' }}>{currentImage.confidence}%</span>
            </div>
          </div>

          {/* Sub Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 9, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Model</span>
              <span style={{ color: '#fff' }}>U-Net (ResNet-50)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Input</span>
              <span style={{ color: '#fff' }}>VV + VH (2-channel)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Image Size</span>
              <span style={{ color: '#fff' }}>1024 × 1024</span>
            </div>
          </div>
        </div>

        {/* CARD 03: SPILL MASK VECTOR */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 900, fontFamily: 'JetBrains Mono', color: 'var(--accent-cyan)' }}>03</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
                  SPILL MASK VECTOR
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Polygon Extraction</div>
              </div>
            </div>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#00ff8822', border: '1px solid #00ff88', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check size={10} color="#00ff88" />
            </div>
          </div>

          {/* SVG Vector Graphic Container */}
          <div style={{
            position: 'relative', height: 115, borderRadius: 4, overflow: 'hidden',
            border: '1px solid var(--border-primary)', background: '#020b18',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="150" height="90" viewBox="0 0 150 90">
              <path
                d="M 20 45 Q 40 15, 80 25 T 135 40 Q 120 75, 80 70 T 20 45 Z"
                fill="rgba(255, 51, 85, 0.25)"
                stroke="#ff3355"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle cx="75" cy="42" r="3.5" fill="#ffffff" stroke="#ff3355" strokeWidth="1.5" />
            </svg>

            {/* Floating Vector Legend */}
            <div style={{
              position: 'absolute', top: 6, right: 6,
              background: 'rgba(2, 11, 24, 0.85)', border: '1px solid var(--border-primary)',
              borderRadius: 3, padding: '3px 6px', fontSize: 8, fontFamily: 'JetBrains Mono',
              display: 'flex', flexDirection: 'column', gap: 2
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, background: '#ff3355', borderRadius: 1 }} />
                <span style={{ color: '#fff' }}>Spill Polygon</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />
                <span style={{ color: 'var(--text-muted)' }}>Centroid</span>
              </div>
            </div>
          </div>

          {/* Sub Vector Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 9, fontFamily: 'JetBrains Mono', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Area</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{currentImage.slickAreaKm2} km²</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Centroid</span>
              <span style={{ color: '#fff' }}>{currentImage.coordinates.lat}° N, {currentImage.coordinates.lon}° E</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Perimeter</span>
              <span style={{ color: '#fff' }}>18.72 km</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Vertices</span>
              <span style={{ color: '#fff' }}>42</span>
            </div>
          </div>
        </div>

        {/* CARD 04: VALIDATION & EVIDENCE */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 900, fontFamily: 'JetBrains Mono', color: '#eab308' }}>04</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
                  VALIDATION EVIDENCE
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>Multi-source Analysis</div>
              </div>
            </div>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#eab30822', border: '1px solid #eab308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={10} color="#eab308" />
            </div>
          </div>

          {/* Likely Oil Spill Badge */}
          <div style={{
            background: 'rgba(0, 255, 136, 0.1)',
            border: '1px solid #00ff88',
            borderRadius: 4,
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} color="#00ff88" />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#00ff88', fontFamily: 'JetBrains Mono' }}>
                Likely Oil Spill
              </span>
            </div>
            <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono', color: '#00ff88', fontWeight: 700 }}>
              Confidence: {currentImage.confidence - 13.8}%
            </span>
          </div>

          {/* Multi-source Parameters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 9, fontFamily: 'JetBrains Mono' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Wind Speed</span>
              <span style={{ color: '#fff' }}>6.2 m/s <span style={{ color: '#00ff88' }}>✓ Normal</span></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Ocean Current</span>
              <span style={{ color: '#fff' }}>0.4 m/s <span style={{ color: '#00ff88' }}>✓ Normal</span></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Wave Height</span>
              <span style={{ color: '#fff' }}>1.1 m <span style={{ color: '#00ff88' }}>✓ Normal</span></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Sentinel-3 (Chl-a)</span>
              <span style={{ color: '#fff' }}>0.12 mg/m³ <span style={{ color: '#00ff88' }}>✓ Low</span></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Look-alike Check</span>
              <span style={{ color: '#fff' }}>No strong match</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Stat/Metric Cards Bar (6 Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
        {/* Metric 1 */}
        <div className="glass-card" style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'rgba(0, 204, 255, 0.1)', padding: 8, borderRadius: 6, border: '1px solid var(--accent-cyan-dim)' }}>
            <Activity size={16} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>MODEL CONFIDENCE</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono' }}>
              {currentImage.confidence}% <span style={{ fontSize: 9, color: '#00ff88' }}>+5.2%</span>
            </div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>U-Net Segmentation</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card" style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'rgba(0, 204, 255, 0.1)', padding: 8, borderRadius: 6, border: '1px solid var(--accent-cyan-dim)' }}>
            <Layers size={16} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>SPILL AREA</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>
              {currentImage.slickAreaKm2} km²
            </div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>From vector polygon</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card" style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'rgba(0, 204, 255, 0.1)', padding: 8, borderRadius: 6, border: '1px solid var(--accent-cyan-dim)' }}>
            <Calendar size={16} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>ACQUISITION TIME</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono' }}>
              {currentImage.date}
            </div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>{currentImage.timeAmPm}</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card" style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'rgba(0, 204, 255, 0.1)', padding: 8, borderRadius: 6, border: '1px solid var(--accent-cyan-dim)' }}>
            <MapPin size={16} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>GEOGRAPHIC CENTROID</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono' }}>
              {currentImage.coordinates.lat}° N, {currentImage.coordinates.lon}° E
            </div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>WGS84 Datum</div>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="glass-card" style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'rgba(0, 204, 255, 0.1)', padding: 8, borderRadius: 6, border: '1px solid var(--accent-cyan-dim)' }}>
            <SlidersHorizontal size={16} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>POLARIZATION CHANNELS</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono' }}>
              {currentImage.polarization}
            </div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>IW_GRDH_1S</div>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="glass-card" style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'rgba(0, 255, 136, 0.1)', padding: 8, borderRadius: 6, border: '1px solid #00ff88' }}>
            <ShieldCheck size={16} color="#00ff88" />
          </div>
          <div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>VALIDATION STATE</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#00ff88', fontFamily: 'JetBrains Mono' }}>
              Likely Oil Spill
            </div>
            <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>Conf: {(currentImage.confidence - 13.8).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* 4. Main Middle Split Grid: Left Detection Map & Right Evidence Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '12px', flex: 1, minHeight: 330 }}>
        
        {/* Left: DETECTION MAP & EVIDENCE OVERLAY */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Layers size={15} color="var(--accent-cyan)" />
              <span style={{ fontSize: 11, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
                DETECTION MAP & EVIDENCE OVERLAY
              </span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>
              {currentImage.coordinates.lat}° N, {currentImage.coordinates.lon}° E
            </span>
          </div>

          {/* Interactive Map View with Floating Controls */}
          <div style={{ flex: 1, minHeight: 270, borderRadius: 6, overflow: 'hidden', position: 'relative', border: '1px solid var(--border-primary)' }}>
            <MapView
              center={[currentImage.coordinates.lat, currentImage.coordinates.lon]}
              zoom={11}
              showSpill={mapLayers.spillPolygon}
              showVessels={mapLayers.vesselTracks}
              showDriftTrail={mapLayers.predictedDrift}
            />

            {/* Floating Layer Toggle Menu on Top Left of Map */}
            <div style={{
              position: 'absolute', top: 12, left: 12, zIndex: 1000,
              background: 'rgba(2, 11, 24, 0.9)',
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
              {(Object.keys(mapLayers) as Array<keyof typeof mapLayers>).map(layerKey => (
                <label key={layerKey} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: mapLayers[layerKey] ? '#fff' : 'var(--text-muted)' }}>
                  <input
                    type="checkbox"
                    checked={mapLayers[layerKey]}
                    onChange={() => toggleLayer(layerKey)}
                    style={{ accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
                  />
                  <span>
                    {layerKey === 'basemap' && 'Satellite Basemap'}
                    {layerKey === 'spillPolygon' && 'Spill Polygon'}
                    {layerKey === 'centroid' && 'Centroid'}
                    {layerKey === 'vesselTracks' && 'Vessel Tracks (AIS)'}
                    {layerKey === 'predictedDrift' && 'Predicted Drift (24h)'}
                    {layerKey === 'coastline' && 'Coastline'}
                    {layerKey === 'ports' && 'Ports'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: DETECTION EVIDENCE PANEL */}
        <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Info size={15} color="var(--accent-cyan)" />
            <span style={{ fontSize: 11, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
              DETECTION EVIDENCE
            </span>
          </div>

          {/* Evidence Sub-Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-primary)', gap: 4 }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'model', label: 'Model vs Validation' },
              { id: 'env', label: 'Environmental' },
              { id: 'metadata', label: 'Metadata' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveEvidenceTab(tab.id as any)}
                style={{
                  padding: '6px 10px',
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono',
                  fontWeight: 700,
                  border: 'none',
                  background: 'transparent',
                  color: activeEvidenceTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  borderBottom: activeEvidenceTab === tab.id ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Evidence Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {/* Progress Bar 1: Model Confidence */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>Model Confidence (Segmentation)</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>{currentImage.confidence}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border-primary)' }}>
                <div style={{ width: `${currentImage.confidence}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-cyan), #ff3355)', borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.3 }}>
                Confidence that the detected pixels are an oil-like slick based on SAR image features (U-Net).
              </div>
            </div>

            {/* Progress Bar 2: Validation Confidence */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>Validation Confidence</span>
                <span style={{ color: '#00ff88', fontWeight: 800 }}>{(currentImage.confidence - 13.8).toFixed(1)}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border-primary)' }}>
                <div style={{ width: `${currentImage.confidence - 13.8}%`, height: '100%', background: '#00ff88', borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.3 }}>
                Confidence after multi-source analysis (weather, ocean conditions, Sentinel-3, look-alike check).
              </div>
            </div>

            {/* Info Advisory Callout Box */}
            <div style={{
              background: 'rgba(0, 204, 255, 0.08)',
              border: '1px solid var(--accent-cyan-dim)',
              borderRadius: 6,
              padding: '10px',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
              marginTop: 'auto'
            }}>
              <Info size={16} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 9, color: 'var(--text-secondary)', lineHeight: 1.4, fontFamily: 'JetBrains Mono' }}>
                This is a potential oil spill detection. Further expert review and additional data are recommended.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Gallery / Selector: 15 DETECTED FRAMES (SAMPLE) */}
      <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#fff', letterSpacing: '0.05em' }}>
              DETECTED FRAMES ({SAR_SEGMENTED_IMAGES.length} SAMPLES - SELECT ANY TO VIEW ACROSS ENTIRE DASHBOARD)
            </span>
          </div>
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
            View All Products
          </button>
        </div>

        {/* Horizontal Scroll / Grid Gallery of all 15 frames */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '10px'
        }}>
          {SAR_SEGMENTED_IMAGES.slice(0, 6).map((img, idx) => {
            const isSelected = selectedImageIndex === idx
            return (
              <div
                key={img.id}
                onClick={() => setSelectedImageIndex(idx)}
                style={{
                  border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-primary)',
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: '#000',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 0 14px rgba(0, 204, 255, 0.4)' : 'none',
                  position: 'relative'
                }}
              >
                <div style={{ height: 75, position: 'relative' }}>
                  <img src={img.path} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', bottom: 3, left: 3,
                    background: 'rgba(2, 11, 24, 0.85)',
                    color: isSelected ? 'var(--accent-cyan)' : '#fff',
                    fontSize: 8, fontWeight: 700, padding: '1px 4px', borderRadius: 2, fontFamily: 'JetBrains Mono'
                  }}>
                    {img.date.split(' ')[0]} {img.date.split(' ')[1]} {img.timeAmPm.slice(0, 5)}
                  </div>
                  <div style={{
                    position: 'absolute', top: 3, right: 3,
                    background: 'rgba(239, 68, 68, 0.85)',
                    color: '#fff', fontSize: 8, fontWeight: 800, padding: '1px 4px', borderRadius: 2, fontFamily: 'JetBrains Mono'
                  }}>
                    #{img.id}
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
