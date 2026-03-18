export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  ingredients: string;
  is_featured: number;
}

export interface CartItem extends Product {
  quantity: number;
  customization?: {
    size: string;
    message: string;
    isEggless: boolean;
    flavour?: string;
    design?: string;
  };
}

export interface Order {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  delivery_date: string;
  delivery_time: string;
  total_amount: number;
  items: string; // JSON string
  status: string;
  created_at: string;
}
