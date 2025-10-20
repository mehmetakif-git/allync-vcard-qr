import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VCardDisplay from './components/VCardDisplay';
import QRGenerator from './components/QRGenerator';
import Analytics from './components/Analytics';
import Navigation from './components/Navigation';
import AdminGuard from './components/AdminGuard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route - vCard için */}
        <Route path="/" element={<VCardDisplay />} />
        <Route path="/allyn" element={<VCardDisplay />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <Navigation />
              <QRGenerator />
            </AdminGuard>
          }
        />
        <Route
          path="/analytics"
          element={
            <AdminGuard>
              <Navigation />
              <Analytics />
            </AdminGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;