import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Almond Chocolate Truffle",
    description: "Rich, moist chocolate cake topped with crunchy almonds and a golden 'Happy Birthday' wish.",
    price: 650,
    category: "Chocolate",
    image_url: "https://image2url.com/r2/default/images/1773226984144-7f345b06-9822-4b21-959f-f42e31280280.png",
    ingredients: "Flour, Cocoa, Butter, Sugar, Eggs, Dark Chocolate, Roasted Almonds",
    is_featured: 1
  },
  {
    id: 2,
    name: "Traditional Saree Doll Cake",
    description: "A beautiful handcrafted cake featuring a traditional saree-clad figurine, perfect for mothers and grandmothers.",
    price: 950,
    category: "Custom",
    image_url: "https://image2url.com/r2/default/images/1773227058963-74aa938f-e831-4a95-9b79-573271915d10.png",
    ingredients: "Flour, Buttermilk, Cream Cheese, Fondant Art",
    is_featured: 1
  },
  {
    id: 3,
    name: "Biscoff Anniversary Special",
    description: "Silky smooth Biscoff cream cake decorated with authentic Lotus Biscoff cookies and gold leaf accents.",
    price: 850,
    category: "Custom",
    image_url: "https://image2url.com/r2/default/images/1773227182831-b88c7fad-d015-4783-9c5d-f9b255a73ec1.png",
    ingredients: "Flour, Biscoff Spread, Lotus Cookies, Butter, Milk",
    is_featured: 1
  },
  {
    id: 4,
    name: "Eggless Vanilla Bean Dream",
    description: "Classic vanilla cake with real Madagascar vanilla beans, made without eggs for a light and airy texture.",
    price: 550,
    category: "Eggless",
    image_url: "https://image2url.com/r2/default/images/1773226984144-7f345b06-9822-4b21-959f-f42e31280280.png",
    ingredients: "Flour, Vanilla Beans, Butter, Milk, Yogurt",
    is_featured: 1
  },
  {
    id: 5,
    name: "Red Velvet Romance",
    description: "Silky red velvet layers with our signature cream cheese frosting.",
    price: 750,
    category: "Red Velvet",
    image_url: "https://image2url.com/r2/default/images/1773227058963-74aa938f-e831-4a95-9b79-573271915d10.png",
    ingredients: "Flour, Buttermilk, Beetroot extract, Cream Cheese",
    is_featured: 0
  }
];
