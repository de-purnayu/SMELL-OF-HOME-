import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Heart, Star, MapPin } from 'lucide-react';

export const About = () => {
  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <img 
            src="https://image2url.com/r2/default/images/1773226984144-7f345b06-9822-4b21-959f-f42e31280280.png" 
            alt="Signature Almond Chocolate Cake" 
            className="rounded-3xl shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-brand-soft-brown font-bold text-xs uppercase tracking-widest mb-4 block">Meet the Baker</span>
          <h1 className="text-6xl mb-8">Malavika Tripaty</h1>
          <div className="prose text-brand-brown/70 space-y-6 text-lg">
            <p>
              Smell of Home started in a small kitchen in Contai with a simple mission: to bring back the authentic taste of homemade baking.
            </p>
            <p>
              I believe that a cake is more than just a dessert; it's a centerpiece for celebrations, a comfort on a rainy day, and a way to show love. That's why I use only the freshest, locally sourced ingredients—no preservatives, no artificial mixes.
            </p>
            <p>
              Every cake that leaves my kitchen is handcrafted with the same care and attention I give to my own family. From the rich chocolate truffle to our delicate red velvet, each recipe has been perfected over years of baking.
            </p>
          </div>
          <div className="mt-10 flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-serif font-bold">500+</p>
              <p className="text-xs text-brand-brown/50 uppercase tracking-widest">Cakes Baked</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-serif font-bold">200+</p>
              <p className="text-xs text-brand-brown/50 uppercase tracking-widest">Happy Families</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-serif font-bold">100%</p>
              <p className="text-xs text-brand-brown/50 uppercase tracking-widest">Homemade</p>
            </div>
          </div>
        </motion.div>
      </div>

      <section className="bg-brand-pink/20 rounded-[3rem] p-12 md:p-24 text-center">
        <h2 className="text-4xl md:text-5xl mb-12">Why Homemade is Special</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { icon: <Heart className="w-10 h-10" />, title: 'Made with Love', desc: 'Personal attention to every detail, from mixing to frosting.' },
            { icon: <Star className="w-10 h-10" />, title: 'Fresh Ingredients', desc: 'No preservatives. We use real butter, fresh cream, and premium cocoa.' },
            { icon: <MapPin className="w-10 h-10" />, title: 'Local & Fresh', desc: 'Baked right here in Contai and delivered fresh to your door.' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 text-brand-soft-brown shadow-sm">
                {item.icon}
              </div>
              <h3 className="text-2xl mb-4">{item.title}</h3>
              <p className="text-brand-brown/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
