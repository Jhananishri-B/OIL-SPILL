import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import CommandCenter from './pages/CommandCenter'
import SatelliteDetection from './pages/SatelliteDetection'
import ValidationDrift from './pages/ValidationDrift'
import AISInvestigation from './pages/AISInvestigation'
import EmergencyResponse from './pages/EmergencyResponse'
import SpillDetailView from './pages/SpillDetailView'
import './index.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Standalone Spill Detail Tab View without layout frame */}
          <Route path="/spill-detail/:id" element={<SpillDetailView />} />

          {/* Main Dashboard Pages inside Sidebar/Header Layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/command-center" replace />} />
                  <Route path="/command-center" element={<CommandCenter />} />
                  <Route path="/satellite-detection" element={<SatelliteDetection />} />
                  <Route path="/validation-drift" element={<ValidationDrift />} />
                  <Route path="/ais-investigation" element={<AISInvestigation />} />
                  <Route path="/emergency-response" element={<EmergencyResponse />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
