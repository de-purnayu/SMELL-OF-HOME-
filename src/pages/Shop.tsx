import React from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { INITIAL_PRODUCTS } from '../constants/products';
import { supabase } from '../lib/supabase';

export const Shop = () => {
  const [products, setProducts] = React.useState<Product[]>(INITIAL_PRODUCTS);
  const [filter, setFilter] = React.useState('All');
  const [search, setSearch] = React.useState('');
  const { addItem } = useCart();

  const categories = ['All', 'Chocolate', 'Vanilla', 'Red Velvet', 'Eggless', 'Custom'];

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (!error && data && data.length > 0) {
          setProducts(data);
        } else {
          // Fallback to static products if Supabase is empty or errors
          setProducts(INITIAL_PRODUCTS);
        }
      } catch (err) {
        console.error("Failed to fetch products from Supabase:", err);
        setProducts(INITIAL_PRODUCTS);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const CustomCakeSection = () => {
    const [customCake, setCustomCake] = React.useState({
      size: '0.5kg',
      flavour: 'Chocolate',
      design: '',
      isEggless: false,
      message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const product: Product = {
        id: Date.now(), // Unique ID for custom cake
        name: `Custom ${customCake.flavour} Cake`,
        description: `Custom design: ${customCake.design}`,
        price: 800, // Base price for custom cake
        category: 'Custom',
        image_url: 'https://image2url.com/r2/default/images/1773227182831-b88c7fad-d015-4783-9c5d-f9b255a73ec1.png',
        ingredients: 'Custom ingredients based on flavour',
        is_featured: 0
      };
      addItem(product, 1, {
        size: customCake.size,
        message: customCake.message,
        isEggless: customCake.isEggless,
        flavour: customCake.flavour,
        design: customCake.design
      });
      alert('Custom cake added to cart!');
      setCustomCake({ size: '0.5kg', flavour: 'Chocolate', design: '', isEggless: false, message: '' });
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-pink/20 p-6 md:p-8 rounded-[2rem] mb-12 border border-brand-pink/50"
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif mb-4 md:mb-6 text-center">Create Your Own Masterpiece</h2>
          <p className="text-center text-sm md:text-base text-brand-brown/70 mb-8">
            Tell us your vision, and Malavika will bake it to life.
          </p>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-brand-soft-brown">Size</label>
              <select 
                value={customCake.size}
                onChange={(e) => setCustomCake({...customCake, size: e.target.value})}
                className="w-full p-3 rounded-xl border border-brand-pink bg-white focus:ring-2 focus:ring-brand-pink outline-none"
              >
                <option>0.5kg</option>
                <option>1kg</option>
                <option>1.5kg</option>
                <option>2kg+</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-brand-soft-brown">Flavour</label>
              <select 
                value={customCake.flavour}
                onChange={(e) => setCustomCake({...customCake, flavour: e.target.value})}
                className="w-full p-3 rounded-xl border border-brand-pink bg-white focus:ring-2 focus:ring-brand-pink outline-none"
              >
                <option>Chocolate</option>
                <option>Vanilla</option>
                <option>Red Velvet</option>
                <option>Butterscotch</option>
                <option>Fruit Cake</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-brand-soft-brown">Design Description</label>
              <textarea 
                required
                placeholder="Describe the design, theme, or any specific decorations you'd like..."
                value={customCake.design}
                onChange={(e) => setCustomCake({...customCake, design: e.target.value})}
                className="w-full p-4 rounded-xl border border-brand-pink bg-white focus:ring-2 focus:ring-brand-pink outline-none h-32"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-brand-soft-brown">Message on Cake</label>
              <input 
                type="text"
                placeholder="Happy Birthday, etc..."
                value={customCake.message}
                onChange={(e) => setCustomCake({...customCake, message: e.target.value})}
                className="w-full p-3 rounded-xl border border-brand-pink bg-white focus:ring-2 focus:ring-brand-pink outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox"
                id="eggless"
                checked={customCake.isEggless}
                onChange={(e) => setCustomCake({...customCake, isEggless: e.target.checked})}
                className="w-5 h-5 accent-brand-soft-brown"
              />
              <label htmlFor="eggless" className="text-sm font-medium">Make it Eggless</label>
            </div>

            <div className="md:col-span-2">
              <button type="submit" className="w-full btn-primary py-4 text-lg shadow-lg">
                Add Custom Cake to Cart
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <header className="mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl mb-4">Our Menu</h1>
        <p className="text-brand-brown/60">Choose from our freshly baked delights</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/40 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for your favorite cake..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat 
                  ? 'bg-brand-brown text-white shadow-md' 
                  : 'bg-white text-brand-brown hover:bg-brand-pink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filter === 'Custom' && <CustomCakeSection />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProducts.map((product) => (
          <motion.div
            layout
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-brand-pink/30"
          >
            <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {product.category}
              </div>
            </Link>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-xl font-serif group-hover:text-brand-soft-brown transition-colors">{product.name}</h3>
                </Link>
                <span className="font-bold text-lg">₹{product.price}</span>
              </div>
              <p className="text-sm text-brand-brown/60 mb-6 line-clamp-2">{product.description}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => addItem(product, 1)}
                  className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <Link 
                  to={`/product/${product.id}`}
                  className="px-4 py-2 bg-brand-pink/30 rounded-full text-brand-brown hover:bg-brand-pink transition-colors flex items-center justify-center"
                >
                  View
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-brand-brown/50">No cakes found matching your search. Try something else!</p>
        </div>
      )}
    </div>
  );
};
