import type { ReactNode } from 'react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Satellite, Wind, Ship, AlertTriangle,
  Shield, Clock, Wifi, User, ChevronRight, Pin, PinOff, Menu
} from 'lucide-react'
import { useLiveTime } from '../hooks/useLiveTime'

const navItems = [
  { path: '/command-center', label: 'Command Center', icon: LayoutDashboard },
  { path: '/satellite-detection', label: 'Satellite Detection', icon: Satellite },
  { path: '/validation-drift', label: 'Validation & Drift', icon: Wind },
  { path: '/ais-investigation', label: 'AIS Investigation', icon: Ship },
  { path: '/emergency-response', label: 'Emergency Response', icon: AlertTriangle },
]

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const time = useLiveTime()
  const currentPage = navItems.find(n => n.path === location.pathname)
  
  // Auto-sliding hover state & pin state
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)

  const isExpanded = isPinned || isHovered

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Top Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: '44px', flexShrink: 0,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-primary)',
        zIndex: 100
      }}>
        {/* Left: Logo & Menu Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? "Unpin Sidebar (Auto-Slide on Hover)" : "Pin Sidebar"}
            style={{
              background: 'transparent',
              border: 'none',
              color: isPinned ? 'var(--accent-cyan)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 4,
              borderRadius: 4
            }}
          >
            <Menu size={18} />
          </button>

          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--accent-cyan-dim)',
            border: '1px solid var(--accent-cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative'
          }}>
            <Shield size={14} color="var(--accent-cyan)" />
            <div style={{
              position: 'absolute', inset: -2,
              borderRadius: '50%',
              border: '1px solid var(--accent-cyan)',
              opacity: 0.3,
              animation: 'pulse-ring 2s infinite'
            }} />
          </div>

          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: 'var(--accent-cyan)', lineHeight: 1 }}>
              MARINEGUARD AI
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
              SATELLITE INTEL V2.4
            </div>
          </div>
        </div>

        {/* Center: Page info */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono', letterSpacing: '0.1em' }}>
            TACTICAL OPERATIONS PLATFORM
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
            Autonomous Maritime Slick Detection & AIS Intercept
          </div>
        </div>

        {/* Right: Status bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="status-dot animate-blink" style={{ background: 'var(--accent-green)' }} />
            <span style={{ fontSize: 10, color: 'var(--accent-green)', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>SYSTEM OPERATIONAL</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: 11, fontFamily: 'JetBrains Mono' }}>
            <Clock size={12} />
            <span>UTC {time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: 11, fontFamily: 'JetBrains Mono' }}>
            <Wifi size={12} color="var(--accent-cyan)" />
            <span style={{ color: 'var(--accent-cyan)' }}>OPSEC LEVEL 3</span>
          </div>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <User size={12} color="var(--text-secondary)" />
          </div>
        </div>
      </header>

      {/* Main Body with Sliding Sidebar Drawer */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        
        {/* Invisible Left Edge Hover Trigger Zone (when collapsed) */}
        {!isPinned && (
          <div
            onMouseEnter={() => setIsHovered(true)}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: 16,
              zIndex: 4999,
              cursor: 'pointer'
            }}
          />
        )}

        {/* Sliding Sidebar Drawer */}
        <aside
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: isPinned ? 'relative' : 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 220,
            zIndex: 5000,
            background: 'rgba(2, 11, 24, 0.96)',
            backdropFilter: 'blur(12px)',
            borderRight: '1px solid var(--accent-cyan-dim)',
            boxShadow: isExpanded ? '10px 0 30px rgba(0, 0, 0, 0.7)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 10px',
            transform: isExpanded ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
            flexShrink: 0
          }}
        >
          {/* Header row in sidebar with Pin / Unpin button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid var(--border-primary)' }}>
            <span style={{ fontSize: 9, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono', letterSpacing: '0.12em', fontWeight: 800 }}>
              MISSION MODULES
            </span>
            <button
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? "Unpin sidebar (auto-collapse)" : "Pin sidebar"}
              style={{
                background: 'none', border: 'none',
                color: isPinned ? 'var(--accent-cyan)' : 'var(--text-muted)',
                cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center'
              }}
            >
              {isPinned ? <Pin size={13} color="var(--accent-cyan)" /> : <PinOff size={13} />}
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => {
                  if (!isPinned) setIsHovered(false)
                }}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono',
                  fontWeight: 700,
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} />
                <span style={{ flex: 1 }}>{label}</span>
                {location.pathname === path && <ChevronRight size={12} color="var(--accent-cyan)" />}
              </NavLink>
            ))}
          </nav>

          <div style={{ flex: 1 }} />

          {/* Bottom status strip inside sidebar */}
          <div style={{ padding: '10px 6px', borderTop: '1px solid var(--border-primary)', background: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
            <div style={{ fontSize: 8, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', letterSpacing: '0.12em', marginBottom: 4 }}>
              DEFENSE APERTURE
            </div>
            <div style={{ fontSize: 10, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
              SAR CONSTELLATION
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <span className="status-dot animate-blink" style={{ background: 'var(--accent-green)', width: 6, height: 6 }} />
              <span style={{ fontSize: 9, color: '#00ff88', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>SENTINEL-1A ACTIVE</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area (Takes Full Width when sidebar is unpinned!) */}
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '100%' }}>
          
          {/* Sub-header */}
          <div style={{
            padding: '8px 16px',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
            background: 'var(--bg-primary)'
          }}>
            <div>
              <div style={{ fontSize: 9, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {currentPage ? 'Live Maritime Dispatch Feed' : ''}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', marginTop: 2 }}>
                {currentPage?.label || ''}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
              <Wifi size={10} color="var(--accent-cyan)" />
              <span style={{ color: 'var(--accent-cyan)' }}>RADAR COMPOSITE ACQUISITION</span>
              <span>·</span>
              <span>AIS SYNC ACTIVE</span>
            </div>
          </div>

          {/* Page content */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {children}
          </div>
        </main>
      </div>

      {/* Footer bar */}
      <div style={{
        height: 22,
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
        fontSize: 9,
        color: 'var(--text-muted)',
        fontFamily: 'JetBrains Mono',
        flexShrink: 0,
        zIndex: 100
      }}>
        <span>DEMONSTRATION DATA — NOT FOR OPERATIONAL USE</span>
        <span>LAT 24°41'12"N · LON 058°19'40"E · FEED: COPERNICUS SENTINEL-1A</span>
      </div>
    </div>
  )
}
