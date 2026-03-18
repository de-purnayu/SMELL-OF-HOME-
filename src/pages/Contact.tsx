import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Phone, Mail, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl mb-6">Get in Touch</h1>
          <p className="text-brand-brown/60 text-lg mb-12">
            Have a question about our cakes or want to discuss a custom order? We'd love to hear from you!
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-pink rounded-2xl flex items-center justify-center text-brand-soft-brown flex-shrink-0">
                <MapPin />
              </div>
              <div>
                <h4 className="font-bold mb-1">Our Kitchen</h4>
                <p className="text-brand-brown/60">Main Road, Contai, West Bengal, 721401</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                <Phone />
              </div>
              <div>
                <h4 className="font-bold mb-1">Call / WhatsApp</h4>
                <p className="text-brand-brown/60">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 flex-shrink-0">
                <Instagram />
              </div>
              <div>
                <h4 className="font-bold mb-1">Instagram</h4>
                <p className="text-brand-brown/60">@smellofhome_contai</p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-brand-pink/20 rounded-3xl">
            <h4 className="text-xl font-serif mb-4 italic">Malavika's Note</h4>
            <p className="text-sm text-brand-brown/70 leading-relaxed">
              "I personally handle all custom order inquiries to ensure your vision comes to life perfectly. Please allow 24-48 hours for a response for complex designs."
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-brand-pink"
        >
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="text-green-600" />
              </div>
              <h2 className="text-3xl mb-4">Message Sent!</h2>
              <p className="text-brand-brown/60">We'll get back to you as soon as possible.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-8 text-brand-soft-brown font-bold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Name</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Email</label>
                  <input type="email" required className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Subject</label>
                <select className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink">
                  <option>General Inquiry</option>
                  <option>Custom Cake Order</option>
                  <option>Feedback</option>
                  <option>Bulk Order</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Message</label>
                <textarea rows={5} required className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink"></textarea>
              </div>
              <button type="submit" className="w-full btn-primary py-4 flex items-center justify-center gap-2">
                Send Message <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};
