import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <Router>
      <nav style={{ textAlign: 'center', margin: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem', color: '#3498db' }}>Accueil</Link>
        {/* 🔒 Lien admin retiré pour garder l’accès secret */}
        <Link to="/admin" style={{ marginRight: '1rem', color: '#3498db' }}>Admin</Link>
        <Link to="/about" style={{ color: '#3498db' }}>À propos</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* 🔐 Route admin secrète */}
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
