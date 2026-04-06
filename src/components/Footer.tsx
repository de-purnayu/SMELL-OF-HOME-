import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin, Send } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-brand-brown text-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link to="/" className="text-3xl font-serif font-bold mb-6 block">Smell of Home</Link>
          <p className="text-white/60 max-w-sm mb-8">
            Authentic, freshly baked homemade cakes by Malavika Tripaty. Bringing the warmth of home-baked goodness to Contai.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <Phone className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-serif mb-6">Quick Links</h4>
          <ul className="space-y-4 text-white/60 text-sm">
            <li><Link to="/shop" className="hover:text-white transition-colors">Our Menu</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Malavika</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/admin" className="hover:text-white transition-colors">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-serif mb-6">Contact Contai</h4>
          <ul className="space-y-4 text-white/60 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span>Main Road, Contai, West Bengal, 721401</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 flex-shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 flex-shrink-0" />
              <span>hello@smellofhome.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 text-center text-white/40 text-[10px] flex flex-col items-center gap-2">
        <p>© {new Date().getFullYear()} Smell of Home. All rights reserved. Handcrafted by Malavika Tripaty.</p>
        <Link to="/admin" className="hover:text-white transition-colors opacity-50 hover:opacity-100">Admin Access</Link>
      </div>
    </footer>
  );
};
