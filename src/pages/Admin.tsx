import React from 'react';
import { motion } from 'motion/react';
import { Order } from '../types';
import { Package, Clock, CheckCircle, User, Phone, MapPin } from 'lucide-react';

export const Admin = () => {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="py-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl mb-2">Admin Dashboard</h1>
          <p className="text-brand-brown/60">Manage your orders and inventory</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-brand-pink">
            <p className="text-xs text-brand-brown/50 uppercase font-bold">Total Orders</p>
            <p className="text-2xl font-serif">{orders.length}</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-brand-pink">
            <p className="text-xs text-brand-brown/50 uppercase font-bold">Revenue</p>
            <p className="text-2xl font-serif">₹{orders.reduce((sum, o) => sum + o.total_amount, 0)}</p>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        <h2 className="text-2xl mb-6">Recent Orders</h2>
        {orders.map((order) => {
          const items = JSON.parse(order.items);
          return (
            <motion.div
              layout
              key={order.id}
              className="bg-white p-6 rounded-3xl shadow-sm border border-brand-pink/30 hover:shadow-md transition-shadow"
            >
              <div className="grid md:grid-cols-4 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-brand-soft-brown font-bold text-xs uppercase">
                    <Package className="w-4 h-4" /> Order #{order.id}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-brand-brown/40" /> {order.customer_name}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-brand-brown/40" /> {order.phone}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-brand-brown/40" /> {order.address}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-brand-brown/40" /> {order.delivery_date} at {order.delivery_time}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-brand-brown/40 mb-2">Items</p>
                  {items.map((item: any, idx: number) => (
                    <p key={idx} className="text-xs">
                      {item.name} x {item.qty} ({item.customization?.size})
                    </p>
                  ))}
                </div>

                <div className="flex flex-col justify-between items-end">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {order.status}
                  </span>
                  <p className="text-xl font-bold">₹{order.total_amount}</p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {orders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-brand-pink">
            <p className="text-brand-brown/40">No orders yet. Sweetness is coming!</p>
          </div>
        )}
      </div>
    </div>
  );
};
