import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Heart, User, LogOut, ClipboardList } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { items } = useCart();
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 glass py-4 px-6 md:px-12 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
          <Heart className="text-brand-brown fill-brand-brown w-5 h-5" />
        </div>
        <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight">Smell of Home</span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-medium transition-colors hover:text-brand-soft-brown ${
              location.pathname === link.path ? 'text-brand-soft-brown' : 'text-brand-brown/70'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {user ? (
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/orders" 
              className="flex items-center gap-2 px-4 py-2 hover:bg-brand-pink/30 text-brand-brown/70 hover:text-brand-soft-brown rounded-full transition-all"
            >
              <ClipboardList className="w-4 h-4" />
              <span className="text-xs font-bold">My Orders</span>
            </Link>
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-pink/30 rounded-full border border-brand-pink">
              <User className="w-4 h-4 text-brand-soft-brown" />
              <span className="text-xs font-bold text-brand-brown truncate max-w-[100px]">
                {user.email?.split('@')[0]}
              </span>
            </div>
            <button 
              onClick={() => signOut()}
              className="p-2 hover:bg-red-50 text-brand-brown/40 hover:text-red-500 rounded-full transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link 
            to="/login" 
            className="hidden md:flex items-center gap-2 px-5 py-2 bg-brand-brown text-white rounded-full text-xs font-bold hover:bg-brand-soft-brown transition-all"
          >
            <User className="w-4 h-4" /> Sign In
          </Link>
        )}

        <Link to="/cart" className="relative p-2 hover:bg-brand-pink rounded-full transition-colors">
          <ShoppingBag className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-brown text-white text-[10px] font-bold min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
        <button 
          className="md:hidden p-2 hover:bg-brand-pink rounded-full transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-brand-brown/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-20 left-4 right-4 bg-brand-cream z-50 shadow-2xl rounded-[2.5rem] border border-brand-pink overflow-y-auto max-h-[calc(100vh-6rem)] md:hidden"
            >
              <div className="p-6 flex flex-col gap-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                        location.pathname === link.path 
                          ? 'bg-brand-pink/50 text-brand-soft-brown font-bold' 
                          : 'text-brand-brown hover:bg-brand-pink/20'
                      }`}
                    >
                      <span className="text-xl font-serif">{link.name}</span>
                      {location.pathname === link.path && <Heart className="w-4 h-4 fill-brand-soft-brown text-brand-soft-brown" />}
                    </Link>
                  </motion.div>
                ))}

                <div className="mt-2 pt-2 border-t border-brand-pink/30">
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <Link 
                        to="/orders" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-4 hover:bg-brand-pink/20 rounded-2xl transition-all"
                      >
                        <ClipboardList className="w-5 h-5 text-brand-soft-brown" />
                        <span className="font-bold text-brand-brown">My Orders</span>
                      </Link>
                      <div className="flex items-center gap-3 p-4 bg-brand-pink/20 rounded-2xl">
                        <User className="w-5 h-5 text-brand-soft-brown" />
                        <span className="font-bold text-brand-brown truncate">{user.email}</span>
                      </div>
                      <button 
                        onClick={() => { signOut(); setIsOpen(false); }}
                        className="flex items-center justify-center gap-2 p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <LogOut className="w-5 h-5" /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 p-4 bg-brand-brown text-white rounded-2xl font-bold transition-all"
                    >
                      <User className="w-5 h-5" /> Sign In
                    </Link>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-brand-pink/30">
                  <Link 
                    to="/shop" 
                    onClick={() => setIsOpen(false)}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-4 rounded-2xl"
                  >
                    Order Now
                  </Link>
                </div>

                <div className="mt-2 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-brand-brown/40 font-bold">
                    Contai's Favorite Bakery
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
