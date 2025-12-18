import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminPage from './pages/AdminPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive
        ? 'bg-white text-indigo-700 shadow-lg shadow-indigo-500/20'
        : 'text-indigo-100 hover:bg-white/10 hover:text-white'
        }`}
    >
      {children}
    </Link>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />

        {/* Modern Gradient Navbar */}
        <nav className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white sticky top-0 z-40 backdrop-blur-lg bg-opacity-95 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/10 group-hover:bg-white/20 transition-all duration-300 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-indigo-200 group-hover:text-white transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight leading-none">Court<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">Ease</span></h1>
                <span className="text-[10px] text-indigo-300 uppercase tracking-widest font-semibold opacity-80">Premium Booking</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2 p-1.5 bg-indigo-950/30 rounded-full backdrop-blur-sm border border-white/5">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/booking">Book Court</NavLink>
              <NavLink to="/my-bookings">My Bookings</NavLink>
            </div>

            {/* Admin Panel Button */}
            <Link to="/admin" className="hidden md:block bg-white text-indigo-900 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-300">
              Admin Panel
            </Link>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-indigo-200 hover:text-white transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-indigo-900/95 backdrop-blur-xl border-t border-white/10 shadow-2xl animate-in slide-in-from-top-5 duration-300">
              <div className="flex flex-col p-6 space-y-4">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-indigo-100 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all font-medium text-lg border border-transparent hover:border-white/5">Home</Link>
                <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="text-indigo-100 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all font-medium text-lg border border-transparent hover:border-white/5">Book Court</Link>
                <Link to="/my-bookings" onClick={() => setIsMenuOpen(false)} className="text-indigo-100 hover:text-white hover:bg-white/10 px-4 py-3 rounded-xl transition-all font-medium text-lg border border-transparent hover:border-white/5">My Bookings</Link>
                <div className="h-px bg-white/10 my-2"></div>
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="bg-white text-indigo-900 px-4 py-3 rounded-xl font-bold shadow-lg text-center hover:scale-[1.02] transition-transform">Admin Panel</Link>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content Area */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={
              <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-gray-50 to-gray-50">
                <div className="animate-in fade-in zoom-in duration-700 slide-in-from-bottom-8">
                  <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">World Class Facilities</span>
                  <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">Play Like a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Pro.</span></h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">Experience the ultimate badminton environment with premium courts, professional coaching, and top-tier equipment.</p>
                  <div className="flex gap-4 justify-center">
                    <Link to="/booking" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all">Book Now</Link>
                    <Link to="/my-bookings" className="bg-white text-indigo-700 px-8 py-4 rounded-xl font-bold shadow-md hover:shadow-lg border border-gray-100 hover:-translate-y-1 transition-all">Check Bookings</Link>
                  </div>
                </div>
              </div>
            } />
            <Route path='/booking' element={<BookingPage />} />
            <Route path='/my-bookings' element={<MyBookingsPage />} />
            <Route path='/admin' element={<AdminPage />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-12 text-center">
          <div className="flex justify-center items-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="bg-indigo-600 p-1.5 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
            <span className="font-bold text-gray-900">CourtEase</span>
          </div>
          <p className="text-gray-500 text-sm">© 2025 CourtEase Badminton. Elevate your game.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App;
