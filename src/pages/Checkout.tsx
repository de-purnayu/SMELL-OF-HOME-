import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle, Calendar, Clock, CreditCard, Truck } from 'lucide-react';

const schema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  street_address: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  zip_code: z.string().min(6, 'Valid zip code is required'),
  payment_method: z.enum(['cod', 'upi', 'card']),
});

export const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      payment_method: 'cod',
    }
  });

  const paymentMethod = watch('payment_method');

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const productName = items.map(i => i.name).join(', ');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          product_name: productName,
          total_amount: total,
        }),
      });
      if (response.ok) {
        if (data.payment_method === 'cod') {
          setIsSuccess(true);
          clearCart();
        } else {
          // Open payment link in a new tab for non-COD methods
          window.open('https://rzp.io/l/sample-payment', '_blank');
          setIsSuccess(true);
          clearCart();
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-32 px-6 text-center max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>
        <h1 className="text-4xl mb-4">Order Confirmed!</h1>
        <p className="text-brand-brown/60 mb-8">
          Thank you for choosing Smell of Home. Malavika has received your order and will start baking shortly!
        </p>
        <Link to="/" className="btn-primary inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-12 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl mb-8 md:mb-12">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-2 gap-16">
        {/* Form */}
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl mb-6 flex items-center gap-2">
              <Truck className="w-6 h-6 text-brand-soft-brown" /> Delivery Details
            </h2>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">First Name</label>
                  <input 
                    {...register('first_name')}
                    className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink"
                    placeholder="First name"
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Last Name</label>
                  <input 
                    {...register('last_name')}
                    className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink"
                    placeholder="Last name"
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Email Address</label>
                <input 
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Street Address</label>
                <input 
                  {...register('street_address')}
                  className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink"
                  placeholder="Flat No, Building, Area"
                />
                {errors.street_address && <p className="text-red-500 text-xs mt-1">{errors.street_address.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">City</label>
                  <input 
                    {...register('city')}
                    className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink"
                    placeholder="City"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Zip Code</label>
                  <input 
                    {...register('zip_code')}
                    className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink"
                    placeholder="Zip code"
                  />
                  {errors.zip_code && <p className="text-red-500 text-xs mt-1">{errors.zip_code.message}</p>}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-brand-soft-brown" /> Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'cod', label: 'Cash on Delivery' },
                { id: 'upi', label: 'UPI' },
                { id: 'card', label: 'Card' },
              ].map(method => (
                <label key={method.id} className="cursor-pointer group">
                  <input 
                    type="radio" 
                    value={method.id}
                    {...register('payment_method')}
                    className="hidden peer"
                  />
                  <div className={`p-4 rounded-2xl border text-center transition-all group-hover:border-brand-brown ${
                    errors.payment_method ? 'border-red-300' : 'border-brand-pink'
                  } peer-checked:bg-brand-brown peer-checked:text-white`}>
                    <p className="text-sm font-bold">{method.label}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div>
          <div className="glass p-6 sm:p-8 rounded-3xl sticky top-32">
            <h2 className="text-2xl mb-6">Your Order</h2>
            <div className="max-h-60 overflow-y-auto mb-6 pr-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex-1">
                    <p className="font-bold">{item.name} x {item.quantity}</p>
                    <p className="text-[10px] text-brand-brown/50">
                      {item.customization?.size} {item.customization?.flavour ? `| ${item.customization.flavour}` : ''}
                    </p>
                  </div>
                  <p className="font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-brand-brown/10 space-y-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : (paymentMethod === 'cod' ? 'Place Order' : 'Pay with UPI OR CARD')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
