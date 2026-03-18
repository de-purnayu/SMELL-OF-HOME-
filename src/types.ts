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
  first_name: string;
  last_name: string;
  email: string;
  street_address: string;
  city: string;
  zip_code: string;
  product_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}
