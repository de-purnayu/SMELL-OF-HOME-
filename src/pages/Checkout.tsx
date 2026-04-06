import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle, Calendar, Clock, CreditCard, Truck, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';

const schema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone_number: z.string().min(10, 'Valid phone number is required'),
  street_address: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  zip_code: z.string().min(6, 'Valid zip code is required'),
  payment_method: z.enum(['cod', 'upi', 'card']),
});

export const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [placedOrder, setPlacedOrder] = React.useState<any>(null);

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
      const orderData = { 
        user_id: user?.id || null,
        first_name: data.first_name, 
        last_name: data.last_name, 
        email: data.email, 
        phone_number: data.phone_number,
        street_address: data.street_address, 
        city: data.city, 
        zip_code: data.zip_code, 
        product_name: productName, 
        total_amount: total, 
        status: 'pending'
      };
      
      // Save directly to Supabase
      const { data: insertedData, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select();
      
      if (!error) {
        setPlacedOrder(insertedData ? insertedData[0] : orderData);
        if (data.payment_method === 'cod') {
          setIsSuccess(true);
          clearCart();
        } else {
          // Open payment link in a new tab for non-COD methods
          window.open('https://rzp.io/l/sample-payment', '_blank');
          setIsSuccess(true);
          clearCart();
        }
      } else {
        console.error("Supabase Order Error:", error);
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-12 px-6 max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          <h1 className="text-4xl mb-4 font-serif">Order Received!</h1>
          <p className="text-brand-brown/70 text-lg mb-2">
            We have received your order. Thank you for ordering!
          </p>
          <p className="text-brand-soft-brown font-bold text-lg mb-8">
            We will call you shortly to confirm the order details.
          </p>
        </div>

        {placedOrder && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-brand-pink mb-12"
          >
            <h2 className="text-2xl font-serif mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-brand-soft-brown" /> Order Section
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-brand-brown/40 uppercase font-bold text-[10px]">Customer</p>
                  <p className="font-medium">{placedOrder.first_name} {placedOrder.last_name}</p>
                </div>
                <div>
                  <p className="text-brand-brown/40 uppercase font-bold text-[10px]">Phone</p>
                  <p className="font-medium">{placedOrder.phone_number}</p>
                </div>
              </div>

              <div>
                <p className="text-brand-brown/40 uppercase font-bold text-[10px]">Ordered Cakes</p>
                <p className="font-medium text-brand-soft-brown">{placedOrder.product_name}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-brand-pink/30">
                <div>
                  <p className="text-brand-brown/40 uppercase font-bold text-[10px]">Total Amount</p>
                  <p className="text-2xl font-bold">₹{placedOrder.total_amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-brand-brown/40 uppercase font-bold text-[10px]">Status</p>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {placedOrder.status}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="text-center">
          <Link to="/" className="btn-primary inline-block px-12">
            Back to Home
          </Link>
        </div>
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
                    className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink text-base"
                    placeholder="First name"
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Last Name</label>
                  <input 
                    {...register('last_name')}
                    className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink text-base"
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
                  className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink text-base"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Phone Number</label>
                <input 
                  {...register('phone_number')}
                  type="tel"
                  className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink text-base"
                  placeholder="+91 00000 00000"
                />
                {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Street Address</label>
                <input 
                  {...register('street_address')}
                  className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink text-base"
                  placeholder="Flat No, Building, Area"
                />
                {errors.street_address && <p className="text-red-500 text-xs mt-1">{errors.street_address.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">City</label>
                  <input 
                    {...register('city')}
                    className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink text-base"
                    placeholder="City"
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Zip Code</label>
                  <input 
                    {...register('zip_code')}
                    className="w-full px-4 py-3 rounded-2xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink text-base"
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
