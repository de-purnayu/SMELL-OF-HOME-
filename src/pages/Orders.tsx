import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Package, Clock, MapPin, Phone, Mail, ShoppingBag, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-soft-brown"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-32 px-6 text-center max-w-lg mx-auto">
        <div className="w-24 h-24 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-8">
          <Package className="w-12 h-12 text-brand-brown/30" />
        </div>
        <h1 className="text-4xl mb-4 font-serif">Sign in to see your orders</h1>
        <p className="text-brand-brown/60 mb-8">Please log in to view your order history and track your cakes.</p>
        <Link to="/login" className="btn-primary inline-block px-12">
          Sign In
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-32 px-6 text-center max-w-lg mx-auto">
        <div className="w-24 h-24 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-12 h-12 text-brand-brown/30" />
        </div>
        <h1 className="text-4xl mb-4 font-serif">No orders yet</h1>
        <p className="text-brand-brown/60 mb-8">You haven't placed any orders yet. Time to treat yourself!</p>
        <Link to="/shop" className="btn-primary inline-block px-12">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl md:text-5xl font-serif">My Orders</h1>
        <span className="text-sm font-medium text-brand-brown/50 bg-brand-pink/30 px-4 py-1 rounded-full">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      <div className="space-y-8">
        {orders.map((order) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={order.id}
            className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-brand-pink/30 hover:shadow-md transition-all"
          >
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-brand-soft-brown font-bold text-xs uppercase tracking-widest">
                  <Package className="w-4 h-4" /> Order #{order.id}
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-brown/70">
                  <Clock className="w-4 h-4 opacity-40" /> {new Date(order.created_at).toLocaleDateString()}
                </div>
                <div className="pt-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-brand-brown/40 mb-2 tracking-widest">Items Ordered</p>
                  <p className="text-sm font-medium text-brand-brown leading-relaxed">{order.product_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-brand-brown/40 mb-1 tracking-widest">Delivery To</p>
                    <p className="text-xs text-brand-brown/70">{order.street_address}, {order.city}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-brand-brown/40 mb-1 tracking-widest">Contact</p>
                    <p className="text-xs text-brand-brown/70">{order.phone_number}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-end border-l border-brand-pink/20 pl-8">
                <p className="text-[10px] uppercase font-bold text-brand-brown/40 mb-1 tracking-widest text-right w-full">Total Paid</p>
                <p className="text-3xl font-serif text-brand-soft-brown">₹{order.total_amount}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-brand-brown/40 text-sm mb-6 italic">Need help with an order? Contact us on WhatsApp or call Malavika directly.</p>
        <Link to="/contact" className="inline-flex items-center gap-2 text-brand-soft-brown font-bold hover:underline">
          Contact Support <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
