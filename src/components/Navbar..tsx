import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, ShieldCheck, Phone } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';

export default function Navbar() {
  const { totalItems, setOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/shop?feature=active_deterrence', label: 'AI Deterrence' },
    { to: '/shop?category=cameras', label: 'Cameras' },
    { to: '/shop?category=recorders', label: 'Recorders' },
    { to: '/shop?category=alarms', label: 'Alarm Systems' },
    { to: '/shop?category=accessories', label: 'Accessories' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-red-700 text-white text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            <span className="hidden sm:inline">Authorized Dahua Distributor · Ain Smara, Constantine, Algeria</span>
            <span className="sm:hidden">Dahua Distributor · Constantine</span>
          </div>
          <a href="tel:0661410139" className="flex items-center gap-1.5 hover:text-red-100 transition-colors">
            <Phone size={14} />
            <span className="font-semibold">0661410139</span>
          </a>
        </div>
      </div>

      {/* Main nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 bg-red-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">M</div>
              <div className="leading-tight">
                <div className="font-extrabold text-lg text-gray-900">Maxitronic</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Security & Surveillance</div>
              </div>
            </Link>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search cameras, alarms, accessories..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none text-sm"
              />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-600">
                <Search size={18} />
              </button>
            </form>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/account" className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-red-600 px-2 py-1.5">
                    <User size={18} /> <span className="hidden lg:inline">Account</span>
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-gray-700 hover:text-red-600 px-2 py-1.5">Logout</button>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:flex items-center gap-1.5 text-sm text-gray-700 hover:text-red-600 px-2 py-1.5">
                  <User size={18} /> <span>Login</span>
                </Link>
              )}
              <button onClick={() => setOpen(true)} className="relative p-2 text-gray-700 hover:text-red-600 transition-colors">
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{totalItems}</span>
                )}
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-700">
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1 h-11">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              <form onSubmit={handleSearch} className="relative mb-2">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 outline-none text-sm"
                />
                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-gray-400"><Search size={18} /></button>
              </form>
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md">
                  {l.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100 mt-2">
                {user ? (
                  <>
                    <Link to="/account" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600">My Account</Link>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600">Logout</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600">Login / Sign Up</Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
