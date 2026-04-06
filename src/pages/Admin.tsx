import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, Product } from '../types';
import { Package, Clock, CheckCircle, User, Phone, MapPin, Mail, Plus, Trash2, Edit, Save, X, Lock, LayoutDashboard, Cake } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'orders' | 'inventory'>('orders');
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = React.useState(false);

  const [newProduct, setNewProduct] = React.useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'Chocolate',
    image_url: '',
    ingredients: '',
    is_featured: 0
  });

  const [error, setError] = React.useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<number | null>(null);

  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!ordersError && ordersData) {
        setOrders(ordersData);
      }

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });
      
      if (!productsError && productsData) {
        setProducts(productsData);
      }
    } catch (err) {
      console.error("Failed to fetch data from Supabase:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select();
      
      if (!error && data) {
        setProducts([...products, data[0]]);
        setIsAddingProduct(false);
        setNewProduct({
          name: '',
          description: '',
          price: 0,
          category: 'Chocolate',
          image_url: '',
          ingredients: '',
          is_featured: 0
        });
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update(editingProduct)
        .eq('id', editingProduct.id);
      
      if (!error) {
        setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
        setEditingProduct(null);
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (!error) {
        setProducts(products.filter(p => p.id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-brand-pink max-w-md w-full"
        >
          <div className="w-16 h-16 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-brand-brown w-8 h-8" />
          </div>
          <h1 className="text-3xl text-center mb-2">Admin Login</h1>
          <p className="text-center text-brand-brown/60 mb-8 text-sm">Please enter your password to access the dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="Enter Password"
              className={`w-full px-6 py-4 rounded-2xl border focus:outline-none focus:ring-2 text-base ${
                error ? 'border-red-500 focus:ring-red-500' : 'border-brand-pink focus:ring-brand-pink'
              }`}
              autoFocus
            />
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center font-medium"
              >
                {error}
              </motion.p>
            )}
            <button type="submit" className="w-full btn-primary py-4 rounded-2xl text-lg">
              Unlock Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (loading) return <div className="py-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl mb-2">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <p className="text-brand-brown/60">Manage your orders and inventory</p>
            <button 
              onClick={handleLogout}
              className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Logout
            </button>
          </div>
        </div>
        
        <div className="flex bg-brand-pink/30 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'orders' ? 'bg-white text-brand-brown shadow-sm' : 'text-brand-brown/60 hover:text-brand-brown'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Orders
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'inventory' ? 'bg-white text-brand-brown shadow-sm' : 'text-brand-brown/60 hover:text-brand-brown'
            }`}
          >
            <Cake className="w-4 h-4" /> Inventory
          </button>
        </div>
      </header>

      {activeTab === 'orders' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl">Recent Orders</h2>
            <div className="flex gap-4">
              <div className="bg-white px-6 py-2 rounded-2xl shadow-sm border border-brand-pink">
                <p className="text-[10px] text-brand-brown/50 uppercase font-bold">Total Orders</p>
                <p className="text-xl font-serif">{orders.length}</p>
              </div>
              <div className="bg-white px-6 py-2 rounded-2xl shadow-sm border border-brand-pink">
                <p className="text-[10px] text-brand-brown/50 uppercase font-bold">Revenue</p>
                <p className="text-xl font-serif">₹{orders.reduce((sum, o) => sum + o.total_amount, 0)}</p>
              </div>
            </div>
          </div>
          
          {orders.map((order) => (
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
                    <User className="w-4 h-4 text-brand-brown/40" /> {order.first_name} {order.last_name}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-brand-brown/40" /> {order.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-brand-brown/40" /> {order.phone_number}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-brand-brown/40" /> {order.street_address}, {order.city} - {order.zip_code}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-brand-brown/40" /> {new Date(order.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase text-brand-brown/40 mb-2">Items</p>
                  <p className="text-xs">{order.product_name}</p>
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
          ))}

          {orders.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-brand-pink">
              <p className="text-brand-brown/40">No orders yet. Sweetness is coming!</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl">Cake Inventory</h2>
            <button 
              onClick={() => setIsAddingProduct(true)}
              className="btn-primary flex items-center gap-2 py-2.5 px-6"
            >
              <Plus className="w-4 h-4" /> Add New Cake
            </button>
          </div>

          <AnimatePresence>
            {(isAddingProduct || editingProduct) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-brand-pink/20 p-8 rounded-[2.5rem] border border-brand-pink overflow-hidden"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-serif">{isAddingProduct ? 'Add New Cake' : 'Edit Cake'}</h3>
                  <button onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }} className="p-2 hover:bg-white rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={isAddingProduct ? handleAddProduct : handleUpdateProduct} className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-brown/40">Cake Name</label>
                    <input 
                      required
                      type="text"
                      value={isAddingProduct ? newProduct.name : editingProduct?.name}
                      onChange={(e) => isAddingProduct ? setNewProduct({...newProduct, name: e.target.value}) : setEditingProduct({...editingProduct!, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-brown/40">Price (₹)</label>
                    <input 
                      required
                      type="number"
                      value={isAddingProduct ? newProduct.price : editingProduct?.price}
                      onChange={(e) => isAddingProduct ? setNewProduct({...newProduct, price: Number(e.target.value)}) : setEditingProduct({...editingProduct!, price: Number(e.target.value)})}
                      className="w-full px-4 py-3 rounded-xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-brown/40">Category</label>
                    <select 
                      value={isAddingProduct ? newProduct.category : editingProduct?.category}
                      onChange={(e) => isAddingProduct ? setNewProduct({...newProduct, category: e.target.value}) : setEditingProduct({...editingProduct!, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink text-base"
                    >
                      <option>Chocolate</option>
                      <option>Vanilla</option>
                      <option>Red Velvet</option>
                      <option>Butterscotch</option>
                      <option>Fruit Cake</option>
                      <option>Custom</option>
                      <option>Eggless</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-brown/40">Image URL</label>
                    <input 
                      required
                      type="text"
                      value={isAddingProduct ? newProduct.image_url : editingProduct?.image_url}
                      onChange={(e) => isAddingProduct ? setNewProduct({...newProduct, image_url: e.target.value}) : setEditingProduct({...editingProduct!, image_url: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink text-base"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-brown/40">Description</label>
                    <textarea 
                      required
                      value={isAddingProduct ? newProduct.description : editingProduct?.description}
                      onChange={(e) => isAddingProduct ? setNewProduct({...newProduct, description: e.target.value}) : setEditingProduct({...editingProduct!, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink text-base h-24"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-brown/40">Ingredients</label>
                    <input 
                      required
                      type="text"
                      value={isAddingProduct ? newProduct.ingredients : editingProduct?.ingredients}
                      onChange={(e) => isAddingProduct ? setNewProduct({...newProduct, ingredients: e.target.value}) : setEditingProduct({...editingProduct!, ingredients: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink text-base"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      id="is_featured"
                      checked={(isAddingProduct ? newProduct.is_featured : editingProduct?.is_featured) === 1}
                      onChange={(e) => {
                        const val = e.target.checked ? 1 : 0;
                        isAddingProduct ? setNewProduct({...newProduct, is_featured: val}) : setEditingProduct({...editingProduct!, is_featured: val});
                      }}
                      className="w-5 h-5 accent-brand-soft-brown"
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium">Feature on Home Page</label>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-2">
                      <Save className="w-5 h-5" /> {isAddingProduct ? 'Create Listing' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-brand-pink/30 flex flex-col">
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {product.is_featured === 1 && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif">{product.name}</h3>
                    <span className="font-bold">₹{product.price}</span>
                  </div>
                  <p className="text-xs text-brand-brown/40 uppercase font-bold mb-2">{product.category}</p>
                  <p className="text-sm text-brand-brown/60 line-clamp-2 mb-6">{product.description}</p>
                  
                  <div className="mt-auto flex gap-2">
                    {deleteConfirmId === product.id ? (
                      <div className="flex-1 flex gap-2">
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors"
                        >
                          Confirm Delete
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => setEditingProduct(product)}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-brand-pink/30 rounded-xl text-brand-brown hover:bg-brand-pink transition-colors text-sm font-bold"
                        >
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="flex items-center justify-center p-2 bg-red-50 rounded-xl text-red-500 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
