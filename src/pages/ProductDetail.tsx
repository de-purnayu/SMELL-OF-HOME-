import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Info, Check, Minus, Plus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [size, setSize] = React.useState('0.5kg');
  const [isEggless, setIsEggless] = React.useState(false);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: Product) => p.id === Number(id));
        if (found) setProduct(found);
      });
  }, [id]);

  if (!product) return <div className="py-20 text-center">Loading...</div>;

  const handleAddToCart = () => {
    addItem(product, quantity, { size, message, isEggless });
    navigate('/cart');
  };

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="rounded-3xl overflow-hidden shadow-xl mb-6 aspect-square">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              'https://image2url.com/r2/default/images/1773226984144-7f345b06-9822-4b21-959f-f42e31280280.png',
              'https://image2url.com/r2/default/images/1773227058963-74aa938f-e831-4a95-9b79-573271915d10.png',
              'https://image2url.com/r2/default/images/1773227182831-b88c7fad-d015-4783-9c5d-f9b255a73ec1.png',
              'https://image2url.com/r2/default/images/1773226984144-7f345b06-9822-4b21-959f-f42e31280280.png'
            ].map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img 
                  src={img} 
                  alt={`Cake view ${i + 1}`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 text-brand-soft-brown font-bold text-xs uppercase tracking-widest mb-4">
            <Heart className="w-4 h-4 fill-current" /> Homemade with Love
          </div>
          <h1 className="text-5xl mb-2">{product.name}</h1>
          <p className="text-3xl font-bold mb-6">₹{product.price}</p>
          
          <div className="prose text-brand-brown/70 mb-8">
            <p>{product.description}</p>
          </div>

          <div className="space-y-8 mb-10">
            {/* Size Selector */}
            <div>
              <label className="block text-sm font-bold mb-3">Select Size</label>
              <div className="flex gap-3">
                {['0.5kg', '1kg', '1.5kg', '2kg'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-6 py-2 rounded-full border transition-all ${
                      size === s ? 'bg-brand-brown text-white border-brand-brown' : 'border-brand-pink hover:bg-brand-pink/30'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Eggless Toggle */}
            <div className="flex items-center justify-between p-4 bg-brand-pink/20 rounded-2xl">
              <div>
                <p className="font-bold">Make it Eggless?</p>
                <p className="text-xs text-brand-brown/60">Pure vegetarian option available</p>
              </div>
              <button
                onClick={() => setIsEggless(!isEggless)}
                className={`w-12 h-6 rounded-full transition-colors relative ${isEggless ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isEggless ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-bold mb-3">Message on Cake</label>
              <input
                type="text"
                placeholder="e.g. Happy Birthday Rahul!"
                className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-6">
              <label className="text-sm font-bold">Quantity</label>
              <div className="flex items-center gap-4 bg-white border border-brand-pink rounded-full px-4 py-2">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="w-4 h-4" /></button>
                <span className="font-bold w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}><Plus className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              className="flex-1 btn-primary flex items-center justify-center gap-2 py-4"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
          </div>

          <div className="mt-12 p-6 bg-white rounded-3xl border border-brand-pink/30">
            <div className="flex items-center gap-2 font-bold mb-4">
              <Info className="w-5 h-5 text-brand-soft-brown" /> Ingredients
            </div>
            <p className="text-sm text-brand-brown/70 leading-relaxed">
              {product.ingredients}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {['No Preservatives', 'Freshly Baked', 'Premium Cocoa', 'Real Butter'].map(tag => (
                <span key={tag} className="flex items-center gap-1 text-[10px] bg-brand-pink/30 px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                  <Check className="w-3 h-3" /> {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
