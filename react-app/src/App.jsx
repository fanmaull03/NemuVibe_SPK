import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PreferenceProvider } from './context/PreferenceContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Ranking from './pages/Ranking';
import CafeDetail from './pages/CafeDetail';
import About from './pages/About';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Preference from './pages/Preference';
import Loading from './pages/Loading';
import Recommendation from './pages/Recommendation';
import AdminPanel from './pages/AdminPanel';
import AddCafe from './pages/AddCafe';
import BottomNav from './components/BottomNav';

function AppContent() {
  const location = useLocation();

  // Sembunyikan Navigasi Bawah di halaman tertentu
  const hideNav = location.pathname === '/login'
    || location.pathname === '/register'
    || location.pathname.startsWith('/detail/')
    || location.pathname === '/about'
    || location.pathname.startsWith('/preferences')
    || location.pathname === '/loading'
    || location.pathname === '/recommendation'
    || location.pathname === '/settings'
    || location.pathname === '/search'
    || location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/detail/:id" element={<CafeDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<Search />} />
        <Route path="/preferences/:category" element={<Preference />} />
        <Route path="/preferences" element={<Preference />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/add" element={<AddCafe />} />
        <Route path="/admin/edit/:id" element={<AddCafe />} />
      </Routes>

      {!hideNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <PreferenceProvider>
        <Router>
          <AppContent />
        </Router>
      </PreferenceProvider>
    </AuthProvider>
  );
}

export default App;
