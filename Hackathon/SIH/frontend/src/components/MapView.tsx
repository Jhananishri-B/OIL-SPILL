import { useEffect } from 'react'
import { MapContainer, TileLayer, Polygon, Polyline, CircleMarker, Popup, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { SarSegmentedImage } from '../utils/sarImages'

// Custom vessel marker icon
const createVesselIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-vessel-marker',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -50%);
      ">
        <div style="
          width: 14px;
          height: 14px;
          background: ${color};
          border: 2px solid #000;
          border-radius: 50%;
          box-shadow: 0 0 10px ${color};
        "></div>
        <div style="
          background: rgba(2, 11, 24, 0.85);
          color: ${color};
          border: 1px solid ${color};
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          padding: 1px 4px;
          border-radius: 2px;
          margin-top: 2px;
          white-space: nowrap;
        ">${label}</div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  })
}

// Custom Port Marker Icon
const createPortIcon = (name: string) => {
  return L.divIcon({
    className: 'custom-port-marker',
    html: `
      <div style="
        display: flex;
        align-items: center;
        gap: 4px;
        background: rgba(4, 21, 37, 0.9);
        border: 1px solid #00ccff;
        padding: 3px 7px;
        border-radius: 4px;
        color: #00ccff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        font-weight: 700;
        box-shadow: 0 0 8px rgba(0, 204, 255, 0.3);
      ">
        <span style="width: 6px; height: 6px; background: #00ccff; border-radius: 50%;"></span>
        <span>${name}</span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  })
}

interface MapViewProps {
  center?: [number, number]
  zoom?: number
  showSpill?: boolean
  showVessels?: boolean
  showDriftTrail?: boolean
  highlightSpill?: { lat: number; lng: number }
  layers?: {
    satellite: boolean
    detectedSpill: boolean
    drift24h: boolean
    drift48h: boolean
    drift72h: boolean
    uncertaintyCone: boolean
    vesselTracks: boolean
    coastlinePorts: boolean
    environmentalVectors: boolean
    protectedAreas: boolean
  }
  activeHorizon?: 'live' | '24h' | '48h' | '72h' | '7d'
  spillData?: SarSegmentedImage
  height?: string
  onZoomIn?: () => void
  onZoomOut?: () => void
  onRecenter?: () => void
}

// Component to programmatically re-center map when center prop changes
function MapRecenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom, { animate: true })
  }, [center, zoom, map])
  return null
}

export default function MapView({
  center = [13.200, 80.380],
  zoom = 11,
  showSpill,
  showVessels,
  showDriftTrail,
  layers: inputLayers,
  spillData,
  height = '100%'
}: MapViewProps) {
  const layers = inputLayers || {
    satellite: true,
    detectedSpill: showSpill !== undefined ? showSpill : true,
    drift24h: showDriftTrail !== undefined ? showDriftTrail : true,
    drift48h: showDriftTrail !== undefined ? showDriftTrail : true,
    drift72h: showDriftTrail !== undefined ? showDriftTrail : true,
    uncertaintyCone: true,
    vesselTracks: showVessels !== undefined ? showVessels : true,
    coastlinePorts: true,
    environmentalVectors: true,
    protectedAreas: false
  }
  const baseLat = spillData?.coordinates.lat || center[0]
  const baseLon = spillData?.coordinates.lon || center[1]

  // Calculated slick shape relative to centroid
  const spillPolygon: [number, number][] = [
    [baseLat + 0.012, baseLon - 0.015],
    [baseLat + 0.022, baseLon + 0.008],
    [baseLat + 0.008, baseLon + 0.028],
    [baseLat - 0.014, baseLon + 0.018],
    [baseLat - 0.018, baseLon - 0.008],
    [baseLat - 0.006, baseLon - 0.022]
  ]

  // Trajectory Waypoints
  const pos24h: [number, number] = [baseLat + 0.033, baseLon + 0.138] // 24h point ENE
  const pos48h: [number, number] = [baseLat + 0.086, baseLon + 0.307] // 48h point ENE
  const pos72h: [number, number] = [baseLat + 0.142, baseLon + 0.498] // 72h point ENE

  // Uncertainty Cone coordinates (spreading out as time increases)
  const uncertaintyConePolygon: [number, number][] = [
    [baseLat, baseLon],
    [baseLat + 0.190, baseLon + 0.540], // Top outer boundary
    [baseLat + 0.090, baseLon + 0.580], // Bottom outer boundary
    [baseLat - 0.010, baseLon + 0.020]
  ]

  // Vessel positions
  const vessels = [
    { name: 'SUSPECT #01: TANKER "OCEAN VANGUARD"', lat: baseLat + 0.010, lng: baseLon + 0.006, color: '#00ccff', mmsi: '563094820', speed: '14.1 KTS', status: 'CRITICAL SUSPECT' },
    { name: 'CARGO "PACIFIC GLORY"', lat: baseLat - 0.025, lng: baseLon + 0.026, color: '#7ab8d4', mmsi: '413298110', speed: '12.4 KTS', status: 'TRAVERSED WINDOW' },
    { name: 'BULK "ASIAN PIONEER"', lat: baseLat - 0.050, lng: baseLon - 0.044, color: '#3d6a82', mmsi: '352001920', speed: '10.2 KTS', status: 'PERIPHERAL' },
    { name: 'ICGS VAJRA (RESPONSE)', lat: baseLat - 0.120, lng: baseLon - 0.024, color: '#00ff88', mmsi: '419000112', speed: '18.5 KTS', status: 'INTERCEPT READY' },
  ]

  // Marine Protected Area (Pulicat Wildlife Sanctuary)
  const protectedAreaPolygon: [number, number][] = [
    [13.38, 80.20],
    [13.48, 80.25],
    [13.45, 80.35],
    [13.35, 80.28]
  ]

  return (
    <div style={{ height, width: '100%', position: 'relative', background: '#020b18', overflow: 'hidden' }}>
      <MapContainer
        center={[baseLat, baseLon]}
        zoom={zoom}
        style={{ height: '100%', width: '100%', background: '#020b18' }}
        zoomControl={false}
      >
        <MapRecenter center={[baseLat, baseLon]} zoom={zoom} />

        {/* Satellite Map Imagery Tile Layer (Esri World Imagery) or OSM fallback */}
        {layers.satellite ? (
          <TileLayer
            attribution='&copy; Esri, Maxar, Earthstar Geographics'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {/* Protected Areas Layer */}
        {layers.protectedAreas && (
          <Polygon
            positions={protectedAreaPolygon}
            pathOptions={{
              color: '#10b981',
              fillColor: '#10b981',
              fillOpacity: 0.25,
              weight: 1.5,
              dashArray: '3, 6'
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'JetBrains Mono', color: '#10b981' }}>
                <strong>PULICAT BIRDS & MARINE SANCTUARY</strong><br />
                Eco-Sensitive Zone (Protected)
              </div>
            </Popup>
          </Polygon>
        )}

        {/* Uncertainty Cone Layer */}
        {layers.uncertaintyCone && (
          <Polygon
            positions={uncertaintyConePolygon}
            pathOptions={{
              color: '#38bdf8',
              fillColor: '#0284c7',
              fillOpacity: 0.15,
              weight: 1.5,
              dashArray: '6, 6'
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'JetBrains Mono', color: '#38bdf8' }}>
                <strong>DRIFT UNCERTAINTY CONE (95% CI)</strong><br />
                Modeled by Hydrodynamic GNOME Mesh
              </div>
            </Popup>
          </Polygon>
        )}

        {/* 72h Drift Trajectory */}
        {layers.drift72h && (
          <>
            <Polyline
              positions={[[baseLat, baseLon], pos24h, pos48h, pos72h]}
              pathOptions={{ color: '#eab308', weight: 2.5, dashArray: '6, 6' }}
            />
            <CircleMarker center={pos72h} radius={5} pathOptions={{ color: '#eab308', fillColor: '#eab308', fillOpacity: 0.9 }}>
              <Popup>
                <div style={{ fontFamily: 'JetBrains Mono' }}>
                  <strong>72h FORWARD DRIFT</strong><br />
                  Est. Position: {pos72h[0].toFixed(3)}° N, {pos72h[1].toFixed(3)}° E<br />
                  Distance: 46.1 km
                </div>
              </Popup>
            </CircleMarker>
          </>
        )}

        {/* 48h Drift Trajectory */}
        {layers.drift48h && (
          <>
            <Polyline
              positions={[[baseLat, baseLon], pos24h, pos48h]}
              pathOptions={{ color: '#f97316', weight: 2.5, dashArray: '6, 6' }}
            />
            <CircleMarker center={pos48h} radius={5} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.9 }}>
              <Popup>
                <div style={{ fontFamily: 'JetBrains Mono' }}>
                  <strong>48h FORWARD DRIFT</strong><br />
                  Est. Position: {pos48h[0].toFixed(3)}° N, {pos48h[1].toFixed(3)}° E<br />
                  Distance: 28.7 km
                </div>
              </Popup>
            </CircleMarker>
          </>
        )}

        {/* 24h Drift Trajectory */}
        {layers.drift24h && (
          <>
            <Polyline
              positions={[[baseLat, baseLon], pos24h]}
              pathOptions={{ color: '#ff3355', weight: 2.5, dashArray: '6, 6' }}
            />
            <CircleMarker center={pos24h} radius={5} pathOptions={{ color: '#ff3355', fillColor: '#ff3355', fillOpacity: 0.9 }}>
              <Popup>
                <div style={{ fontFamily: 'JetBrains Mono' }}>
                  <strong>24h FORWARD DRIFT</strong><br />
                  Est. Position: {pos24h[0].toFixed(3)}° N, {pos24h[1].toFixed(3)}° E<br />
                  Distance: 12.4 km
                </div>
              </Popup>
            </CircleMarker>
          </>
        )}

        {/* Detected Spill (Current) Polygon */}
        {layers.detectedSpill && (
          <Polygon
            positions={spillPolygon}
            pathOptions={{
              color: '#ff3355',
              fillColor: '#ff3355',
              fillOpacity: 0.65,
              weight: 2
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'JetBrains Mono', color: '#fff' }}>
                <strong style={{ color: '#ff3355' }}>CURRENT SPILL SLICK</strong><br />
                Slick Area: {spillData?.slickAreaKm2 || 12.36} km²<br />
                Confidence: {spillData?.confidence || 91}%<br />
                Centroid: {baseLat.toFixed(3)}° N, {baseLon.toFixed(3)}° E
              </div>
            </Popup>
          </Polygon>
        )}

        {/* Ports & Coastlines */}
        {layers.coastlinePorts && (
          <>
            <Marker position={[13.250, 80.330]} icon={createPortIcon('Ennore Port')}>
              <Popup>
                <div style={{ fontFamily: 'JetBrains Mono' }}>
                  <strong>Ennore Port Terminal</strong><br />
                  Major Commercial Port Zone
                </div>
              </Popup>
            </Marker>
            <Marker position={[13.085, 80.295]} icon={createPortIcon('Chennai Port')}>
              <Popup>
                <div style={{ fontFamily: 'JetBrains Mono' }}>
                  <strong>Chennai Port Complex</strong><br />
                  Coast Guard Command Base
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Vessel Tracks & AIS Markers */}
        {layers.vesselTracks && vessels.map((v, idx) => (
          <Marker
            key={idx}
            position={[v.lat, v.lng]}
            icon={createVesselIcon(v.color, v.name.split(' ')[0] + ' ' + (v.name.split(' ')[1] || ''))}
          >
            <Popup>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#e0f4ff' }}>
                <strong style={{ color: v.color }}>{v.name}</strong><br />
                MMSI: {v.mmsi}<br />
                Speed: {v.speed}<br />
                Status: {v.status}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Environmental Vectors (Wind & Current Arrows on Map) */}
        {layers.environmentalVectors && (
          <Polyline
            positions={[[baseLat + 0.05, baseLon + 0.05], [baseLat + 0.09, baseLon + 0.09]]}
            pathOptions={{ color: '#00ccff', weight: 2 }}
          />
        )}
      </MapContainer>
    </div>
  )
}
