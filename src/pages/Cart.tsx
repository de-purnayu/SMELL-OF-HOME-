import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart = () => {
  const { items, removeItem, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="py-32 px-6 text-center max-w-lg mx-auto">
        <div className="w-24 h-24 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-12 h-12 text-brand-brown/30" />
        </div>
        <h1 className="text-4xl mb-4">Your cart is empty</h1>
        <p className="text-brand-brown/60 mb-8">Looks like you haven't added any sweetness to your cart yet.</p>
        <Link to="/shop" className="btn-primary inline-block">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-serif">Your Cart</h1>
        <span className="text-sm font-medium text-brand-brown/50 bg-brand-pink/30 px-4 py-1 rounded-full">
          {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4 md:space-y-6">
          {items.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative flex flex-row gap-4 md:gap-6 p-4 md:p-6 bg-white rounded-[2rem] shadow-sm hover:shadow-md transition-all border border-brand-pink/30"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-brand-cream">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base md:text-xl font-serif truncate leading-tight mb-1">{item.name}</h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] md:text-xs text-brand-brown/60">
                      <span>Size: {item.customization?.size}</span>
                      {item.customization?.flavour && <span>• {item.customization.flavour}</span>}
                      {item.customization?.isEggless && <span className="text-green-600 font-bold">Eggless</span>}
                    </div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-brand-brown/30 hover:text-red-500 hover:bg-red-50 rounded-full transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>

                {item.customization?.design && (
                  <p className="mt-2 text-[10px] md:text-xs italic text-brand-brown/40 line-clamp-1">
                    Design: {item.customization.design}
                  </p>
                )}

                <div className="mt-auto pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-3 bg-brand-cream rounded-full px-3 py-1.5 border border-brand-pink">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:text-brand-soft-brown transition-colors"
                    >
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                    <span className="font-bold text-sm md:text-base min-w-[1rem] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-brand-soft-brown transition-colors"
                    >
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                  <p className="font-bold text-base md:text-lg">₹{item.price * item.quantity}</p>
                </div>
              </div>
            </motion.div>
          ))}
          
          <Link to="/shop" className="flex items-center justify-center gap-2 py-4 text-sm font-medium text-brand-brown/60 hover:text-brand-soft-brown transition-colors">
            <Plus className="w-4 h-4" /> Add more sweetness
          </Link>
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="glass p-6 md:p-8 rounded-[2.5rem] sticky top-32 shadow-xl shadow-brand-brown/5">
            <h2 className="text-xl md:text-2xl mb-6 font-serif">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm md:text-base text-brand-brown/70">
                <span>Subtotal</span>
                <span className="font-medium">₹{total}</span>
              </div>
              <div className="flex justify-between text-sm md:text-base text-brand-brown/70">
                <span>Delivery (Contai)</span>
                <span className="text-green-600 font-bold">FREE</span>
              </div>
              <div className="pt-4 border-t border-brand-brown/10 flex justify-between text-lg md:text-xl font-bold">
                <span>Total</span>
                <span className="text-brand-soft-brown">₹{total}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Coupon Code"
                  className="w-full px-5 py-3 rounded-2xl border border-brand-pink bg-white/50 focus:outline-none focus:ring-2 focus:ring-brand-pink text-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-brand-brown text-white rounded-xl text-xs font-bold hover:bg-brand-soft-brown transition-colors">
                  Apply
                </button>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg shadow-lg shadow-brand-brown/20"
              >
                Checkout <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 p-4 bg-brand-pink/20 rounded-2xl border border-brand-pink/50">
              <p className="text-[10px] text-center text-brand-brown/60 leading-relaxed">
                * We currently deliver only within Contai. <br />
                Orders are freshly baked upon confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
