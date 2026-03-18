import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, Clock, CheckCircle, MapPin, Menu } from 'lucide-react';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../constants/products';
import { supabase } from '../lib/supabase';

export const Home = () => {
  const [featured, setFeatured] = React.useState<Product[]>(INITIAL_PRODUCTS.filter(p => p.is_featured));

  React.useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', 1);
        
        if (!error && data && data.length > 0) {
          setFeatured(data);
        } else {
          setFeatured(INITIAL_PRODUCTS.filter(p => p.is_featured));
        }
      } catch (err) {
        console.error("Failed to fetch featured products from Supabase:", err);
        setFeatured(INITIAL_PRODUCTS.filter(p => p.is_featured));
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center px-6 md:px-12 py-20 bg-brand-pink/30">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 bg-white rounded-full text-xs font-bold uppercase tracking-widest text-brand-soft-brown mb-6">
              Handcrafted with Love in Contai
            </span>
            <h1 className="text-5xl md:text-8xl font-serif leading-tight mb-6">
              Freshly Baked <br />
              <span className="text-brand-soft-brown italic">Happiness</span>
            </h1>
            <p className="text-base md:text-lg text-brand-brown/70 mb-8 max-w-md">
              Authentic homemade cakes made with the finest ingredients. Every bite tells a story of home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary flex items-center gap-2">
                Order Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/shop" className="btn-secondary">
                View Menu
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://image2url.com/r2/default/images/1773227182831-b88c7fad-d015-4783-9c5d-f9b255a73ec1.png" 
                alt="Signature Biscoff Cake" 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-blue rounded-full -z-0 animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-brand-pink rounded-full -z-0 animate-bounce" style={{ animationDuration: '5s' }} />
          </motion.div>
        </div>
      </section>

      {/* Featured Cakes */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">Our Signature Creations</h2>
          <p className="text-brand-brown/60">Handpicked favorites from Malavika's kitchen</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((cake, idx) => (
            <motion.div
              key={cake.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to={`/product/${cake.id}`}>
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img 
                    src={cake.image_url} 
                    alt={cake.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="text-xl mb-1 group-hover:text-brand-soft-brown transition-colors">{cake.name}</h3>
                <p className="text-sm text-brand-brown/60 mb-2">{cake.category}</p>
                <p className="font-bold text-lg">₹{cake.price}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">How to Get Your Cake</h2>
            <p className="text-brand-brown/60">Simple steps to sweetness</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: <Menu className="w-8 h-8" />, title: 'Choose', desc: 'Browse our menu and pick your favorite flavor.' },
              { icon: <Star className="w-8 h-8" />, title: 'Customize', desc: 'Add a message, choose size and egg/eggless options.' },
              { icon: <Clock className="w-8 h-8" />, title: 'Order', desc: 'Place your order and select delivery time.' },
              { icon: <CheckCircle className="w-8 h-8" />, title: 'Delivered', desc: 'Freshly baked cake delivered to your doorstep in Contai.' },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-brand-pink/50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-brown">
                  {step.icon}
                </div>
                <h3 className="text-xl mb-3">{step.title}</h3>
                <p className="text-sm text-brand-brown/70 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl mb-8 leading-tight">What our local <br /> community says</h2>
            <div className="space-y-8">
              {[
                { name: 'Ananya Das', text: 'The best chocolate truffle I have ever had in Contai! So moist and rich.', role: 'Regular Customer' },
                { name: 'Rahul Sen', text: 'Malavika made a custom cake for my daughter\'s birthday. It was beautiful and delicious.', role: 'Parent' },
              ].map((t, idx) => (
                <div key={idx} className="p-6 bg-white rounded-2xl shadow-sm border border-brand-pink">
                  <div className="flex gap-1 text-yellow-500 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="italic text-brand-brown/80 mb-4">"{t.text}"</p>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-brand-brown/50">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://image2url.com/r2/default/images/1773227058963-74aa938f-e831-4a95-9b79-573271915d10.png" 
              alt="Malavika's Signature Doll Cake" 
              className="rounded-3xl shadow-xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl max-w-xs">
              <p className="text-sm font-medium">"I bake every cake as if it's for my own family. That's the secret ingredient."</p>
              <p className="text-xs mt-2 text-brand-soft-brown font-bold">— Malavika Tripaty</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
