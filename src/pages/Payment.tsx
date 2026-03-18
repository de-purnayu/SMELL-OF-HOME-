import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';

export const Payment = () => {
  const location = useLocation();
  const { orderId, total, method } = location.state || { orderId: 'N/A', total: 0, method: 'upi' };

  return (
    <div className="py-20 px-6 max-w-2xl mx-auto">
      <Link to="/checkout" className="flex items-center gap-2 text-brand-brown/60 hover:text-brand-brown mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Checkout</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 md:p-12 rounded-[3rem] shadow-xl border border-brand-pink/30"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif">Secure Payment</h1>
          <div className="p-3 bg-brand-pink/50 rounded-2xl">
            <CreditCard className="w-6 h-6 text-brand-soft-brown" />
          </div>
        </div>

        <div className="space-y-6 mb-10">
          <div className="flex justify-between py-4 border-b border-brand-brown/10">
            <span className="text-brand-brown/60">Order ID</span>
            <span className="font-bold">#{orderId}</span>
          </div>
          <div className="flex justify-between py-4 border-b border-brand-brown/10">
            <span className="text-brand-brown/60">Payment Method</span>
            <span className="font-bold uppercase">{method}</span>
          </div>
          <div className="flex justify-between py-4">
            <span className="text-brand-brown/60">Total Amount</span>
            <span className="text-2xl font-bold">₹{total}</span>
          </div>
        </div>

        <div className="bg-brand-pink/20 p-6 rounded-3xl mb-10">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl">
              <ExternalLink className="w-5 h-5 text-brand-soft-brown" />
            </div>
            <div>
              <p className="font-bold mb-1">Sample Payment Link</p>
              <p className="text-sm text-brand-brown/60 mb-4">
                This is a simulated payment gateway. Click the link below to complete your transaction.
              </p>
              <a 
                href="https://rzp.io/l/sample-payment" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-soft-brown font-bold hover:underline"
              >
                https://rzp.io/l/sample-payment
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            className="w-full btn-primary py-4 text-lg"
            onClick={() => {
              // In a real app, this would be handled by the payment gateway callback
              alert('In a real application, you would be redirected to the payment provider. For this demo, please click the sample link above or assume payment is successful.');
            }}
          >
            Pay Now ₹{total}
          </button>
          
          <div className="flex items-center justify-center gap-2 text-[10px] text-brand-brown/40 uppercase tracking-widest font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>Encrypted & Secure Transaction</span>
          </div>
        </div>
      </motion.div>

      <div className="mt-12 text-center">
        <p className="text-sm text-brand-brown/60 italic">
          "Baking memories, one slice at a time."
        </p>
      </div>
    </div>
  );
};
