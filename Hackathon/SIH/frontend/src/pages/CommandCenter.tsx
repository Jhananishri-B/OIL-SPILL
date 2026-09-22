import { useState } from 'react'
import { Eye, Search, BarChart2, ExternalLink, Map, Table, Filter, ShieldAlert, CheckCircle2, Clock } from 'lucide-react'
import MapView from '../components/MapView'
import { SAR_SEGMENTED_IMAGES, type SarSegmentedImage } from '../utils/sarImages'

const metrics = [
  { label: 'Active Spills', value: '15', unit: 'DETECTED', color: 'var(--accent-red)', unitColor: 'var(--accent-red)' },
  { label: 'Total Spill Area', value: '202.9', unit: 'km²', color: 'var(--text-primary)', unitColor: 'var(--text-secondary)' },
  { label: 'Avg Confidence', value: '94.8', unit: '%', color: 'var(--text-primary)', unitColor: 'var(--text-secondary)' },
  { label: 'AIS Candidates', value: '15', unit: 'INTERCEPT READY', color: 'var(--accent-cyan)', unitColor: 'var(--accent-cyan)' },
]

const envData = [
  { label: 'METOCEAN SURFACE WIND', value: '11.8 KTS FROM 220° (SSW)', status: 'STABLE', statusColor: 'var(--accent-green)' },
  { label: 'HYCOM TIDAL CURRENT', value: '0.82 M/S @ BEARING 045°', status: 'SYNCHRONIZED', statusColor: 'var(--accent-cyan)' },
  { label: 'LAGRANGIAN DRIFT BACK-TRACE', value: 'COHERENCE RATIO 0.91', status: 'CORRELATED', statusColor: 'var(--accent-cyan)' },
]

export default function CommandCenter() {
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table')
  // Default to Index 0 (SPILL-01), which is the most recent oil spill (22 Sep 2026)
  const [selectedSpillIndex, setSelectedSpillIndex] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL')

  // Recent oil spill is always index 0 (22 Sep 2026)
  const mostRecentSpill: SarSegmentedImage = SAR_SEGMENTED_IMAGES[0]
  // Currently inspected spill in panel
  const activeSarImage: SarSegmentedImage = SAR_SEGMENTED_IMAGES[selectedSpillIndex] || mostRecentSpill

  // Filtered spill records
  const filteredSpills = SAR_SEGMENTED_IMAGES.filter((item) => {
    const matchesSearch =
      item.spillNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.placeOfSpill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.timeAmPm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notifiedAlert.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSeverity = filterSeverity === 'ALL' || item.severityLevel === filterSeverity
    return matchesSearch && matchesSeverity
  })

  // Open spill record in a new browser tab
  const handleOpenNewTab = (id: number) => {
    window.open(`/spill-detail/${id}`, '_blank')
  }

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Metrics strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        borderBottom: '1px solid var(--border-primary)',
        flexShrink: 0,
      }}>
        {metrics.map((m, i) => (
          <div key={i} style={{
            padding: '10px 16px',
            borderRight: i < 3 ? '1px solid var(--border-primary)' : 'none',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {m.label}
              <BarChart2 size={10} color="var(--text-muted)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span className="metric-value" style={{ color: m.color, fontSize: 20 }}>{m.value}</span>
              <span className="metric-unit" style={{ color: m.unitColor, fontSize: 10 }}>{m.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Center Panel: Spill Entries Table / Map View */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Controls Bar for Center Area */}
          <div style={{
            padding: '10px 14px',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={16} color="var(--accent-cyan)" />
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                  SPILL DETECTION INCIDENT REGISTER ({SAR_SEGMENTED_IMAGES.length} ENTRIES)
                </span>
                <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                  CLICK ANY ROW TO OPEN HIGHLIGHTED OIL SPILL IMAGE IN A NEW TAB
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Search input */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={12} style={{ position: 'absolute', left: 8, color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search date, spill, place..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 4,
                    padding: '4px 8px 4px 26px',
                    fontSize: 10,
                    color: 'var(--text-primary)',
                    fontFamily: 'JetBrains Mono',
                    width: 180
                  }}
                />
              </div>

              {/* Severity Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Filter size={11} color="var(--text-muted)" />
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 4,
                    padding: '4px 6px',
                    fontSize: 10,
                    color: 'var(--accent-cyan)',
                    fontFamily: 'JetBrains Mono',
                    cursor: 'pointer'
                  }}
                >
                  <option value="ALL">ALL SEVERITIES</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="SEVERE">SEVERE</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MODERATE">MODERATE</option>
                </select>
              </div>

              {/* View Switcher: Table vs Map */}
              <div style={{ display: 'flex', background: 'var(--bg-primary)', borderRadius: 4, border: '1px solid var(--border-primary)', padding: 2 }}>
                <button
                  onClick={() => setViewMode('table')}
                  style={{
                    background: viewMode === 'table' ? 'var(--accent-cyan)' : 'transparent',
                    color: viewMode === 'table' ? '#000' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: 3,
                    padding: '4px 8px',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Table size={12} /> TABLE
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  style={{
                    background: viewMode === 'map' ? 'var(--accent-cyan)' : 'transparent',
                    color: viewMode === 'map' ? '#000' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: 3,
                    padding: '4px 8px',
                    fontSize: 10,
                    fontFamily: 'JetBrains Mono',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Map size={12} /> MAP
                </button>
              </div>
            </div>
          </div>

          {/* Center Content Body */}
          <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-primary)' }}>
            {viewMode === 'table' ? (
              <div style={{ padding: '12px' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: '0 6px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: 11
                }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: 9, letterSpacing: '0.08em', textAlign: 'left' }}>
                      <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-primary)' }}>spill.no</th>
                      <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-primary)' }}>date</th>
                      <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-primary)' }}>time with AM/PM</th>
                      <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-primary)' }}>place of spill</th>
                      <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-primary)' }}>severity level</th>
                      <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-primary)' }}>notified alert</th>
                      <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-primary)', textAlign: 'right' }}>action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSpills.map((spill) => {
                      const isSelected = selectedSpillIndex === (spill.id - 1)
                      const sevBadge = getSeverityStyle(spill.severityLevel)

                      return (
                        <tr
                          key={spill.id}
                          onClick={() => {
                            setSelectedSpillIndex(spill.id - 1)
                            handleOpenNewTab(spill.id)
                          }}
                          style={{
                            background: isSelected ? 'rgba(0, 204, 255, 0.08)' : 'var(--bg-secondary)',
                            border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-primary)',
                            borderRadius: 4,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: isSelected ? '0 0 10px rgba(0, 204, 255, 0.2)' : 'none'
                          }}
                          className="table-row-hover"
                        >
                          {/* spill.no */}
                          <td style={{ padding: '10px 12px', borderRadius: '4px 0 0 4px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{
                                background: 'rgba(0, 204, 255, 0.15)',
                                padding: '2px 6px',
                                borderRadius: 3,
                                border: '1px solid var(--accent-cyan-dim)',
                                fontSize: 10
                              }}>
                                {spill.spillNo}
                              </span>
                              {spill.id === 1 && (
                                <span style={{
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  color: '#ff3355',
                                  fontSize: 8,
                                  fontWeight: 800,
                                  padding: '1px 4px',
                                  borderRadius: 2,
                                  border: '1px solid #ff3355'
                                }}>
                                  RECENT
                                </span>
                              )}
                            </div>
                          </td>

                          {/* date */}
                          <td style={{ padding: '10px 12px', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {spill.date}
                          </td>

                          {/* time with AM/PM */}
                          <td style={{ padding: '10px 12px', color: 'var(--accent-cyan)', whiteSpace: 'nowrap', fontWeight: 700 }}>
                            {spill.timeAmPm}
                          </td>

                          {/* place of spill */}
                          <td style={{ padding: '10px 12px', color: 'var(--text-primary)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {spill.placeOfSpill}
                          </td>

                          {/* severity level */}
                          <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: 3,
                              fontSize: 9,
                              fontWeight: 800,
                              ...sevBadge
                            }}>
                              {spill.severityLevel}
                            </span>
                          </td>

                          {/* notified alert */}
                          <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: 3,
                              fontSize: 9,
                              fontWeight: 700,
                              background: 'rgba(0, 255, 136, 0.1)',
                              border: '1px solid #00ff88',
                              color: '#00ff88',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}>
                              <CheckCircle2 size={10} /> {spill.notifiedAlert}
                            </span>
                          </td>

                          {/* action button */}
                          <td style={{ padding: '10px 12px', borderRadius: '0 4px 4px 0', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedSpillIndex(spill.id - 1)
                                handleOpenNewTab(spill.id)
                              }}
                              style={{
                                background: 'rgba(0, 204, 255, 0.15)',
                                color: 'var(--accent-cyan)',
                                border: '1px solid var(--accent-cyan)',
                                borderRadius: 3,
                                padding: '4px 8px',
                                fontSize: 9,
                                fontFamily: 'JetBrains Mono',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                            >
                              OPEN TAB <ExternalLink size={10} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Map View toggle mode */
              <div style={{ height: '100%', width: '100%', position: 'relative' }}>
                <MapView
                  showSpill
                  showVessels
                  showDriftTrail
                  highlightSpill={{ lat: activeSarImage.coordinates.lat, lng: activeSarImage.coordinates.lon }}
                />
              </div>
            )}
          </div>

          {/* Environmental strip at bottom of center area */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            borderTop: '1px solid var(--border-primary)',
            flexShrink: 0,
            background: 'var(--bg-card)'
          }}>
            {envData.map((e, i) => (
              <div key={i} style={{
                padding: '8px 12px',
                borderRight: i < 2 ? '1px solid var(--border-primary)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'JetBrains Mono' }}>
                    {e.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', marginTop: 2 }}>
                    {e.value}
                  </div>
                </div>
                <span className="tag-active" style={{ color: e.statusColor, borderColor: e.statusColor, background: e.statusColor + '22' }}>
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Column - RECENT OIL SPILL INCIDENT RECORD PANEL */}
        <div style={{
          width: 320, flexShrink: 0,
          borderLeft: '1px solid var(--border-primary)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--bg-card)'
        }}>
          {/* Header explicitly highlighting Recent Oil Spill */}
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              INCIDENT RECORD (RECENT SPILL)
            </span>
            <span className="tag-critical">CRITICAL SLICK</span>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
            {/* Recent Spill Banner Callout */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--accent-red)',
              borderRadius: 4,
              padding: '6px 10px',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: '#ff3355', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={11} /> MOST RECENT DETECTION
              </div>
              <div style={{ fontSize: 9, fontFamily: 'JetBrains Mono', color: '#fff', fontWeight: 700 }}>
                {mostRecentSpill.date}
              </div>
            </div>

            {/* Incident ID */}
            <div style={{ marginBottom: 12 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, fontFamily: 'JetBrains Mono' }}>
                INCIDENT #{activeSarImage.spillNo.replace('SPILL-', 'MG-2026-')}
              </h2>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>
                Automated Sentinel-1 Synthetic Aperture Radar detection with temporal AIS correlation.
              </p>
            </div>

            <div className="divider" />

            {/* Data fields */}
            {[
              { label: 'SPILL NUMBER', value: activeSarImage.spillNo, valueColor: 'var(--accent-cyan)' },
              { label: 'DETECTION DATE', value: activeSarImage.date, valueColor: '#fff' },
              { label: 'DETECTION TIME (AM/PM)', value: activeSarImage.timeAmPm, valueColor: 'var(--accent-cyan)' },
              { label: 'LOCATION', value: activeSarImage.placeOfSpill },
              { label: 'CENTROID COORDINATES', value: activeSarImage.coordinates.formatted },
              { label: 'SATELLITE SENSOR', value: activeSarImage.sensor },
              { label: 'DISCHARGE PROBABILITY', value: `HIGH (${activeSarImage.confidence}%)`, valueColor: 'var(--accent-red)' },
              { label: 'SURFACE SLICK AREA', value: `${activeSarImage.slickAreaKm2} km²`, valueColor: 'var(--accent-cyan)' },
              { label: 'NOTIFIED ALERT STATUS', value: activeSarImage.notifiedAlert, valueColor: '#00ff88' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.08em', maxWidth: '45%', lineHeight: 1.4 }}>
                  {f.label}
                </span>
                <span style={{ fontSize: 10, color: f.valueColor || 'var(--text-primary)', fontFamily: 'JetBrains Mono', textAlign: 'right', maxWidth: '52%', fontWeight: 700 }}>
                  {f.value}
                </span>
              </div>
            ))}

            <div className="divider" />

            {/* SAR visualization with REAL SAR Segmented Image */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
                <span>SAR SEGMENTATION ({activeSarImage.spillNo})</span>
                <span style={{ color: 'var(--accent-cyan)' }}>{activeSarImage.slickAreaKm2} km²</span>
              </div>
              <div style={{
                height: 110, background: '#010a14',
                borderRadius: 4, border: '1px solid var(--accent-cyan-dim)',
                position: 'relative', overflow: 'hidden'
              }}>
                <img
                  src={activeSarImage.path}
                  alt={activeSarImage.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', bottom: 4, right: 6,
                  background: 'rgba(0,0,0,0.75)', padding: '2px 6px', borderRadius: 2,
                  fontSize: 8, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono', fontWeight: 700
                }}>
                  {activeSarImage.spillNo} MASK LOADED
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
              <button
                className="btn-primary"
                onClick={() => handleOpenNewTab(activeSarImage.id)}
                style={{ justifyContent: 'center' }}
              >
                <Eye size={13} /> OPEN SPILL #{activeSarImage.id} IN NEW TAB
              </button>
              <button className="btn-ghost" style={{ justifyContent: 'center' }}>
                <Search size={13} /> INVESTIGATE VESSEL SUSPECT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
