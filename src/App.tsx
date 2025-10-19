import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VCardDisplay from './components/VCardDisplay';
import QRGenerator from './components/QRGenerator';
import Analytics from './components/Analytics';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<VCardDisplay />} />
        <Route path="/admin" element={<QRGenerator />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;
