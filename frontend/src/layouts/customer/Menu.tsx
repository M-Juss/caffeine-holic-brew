import { useState } from "react";
import MenuCard from "@/components/common/MenuCard";
import CartPanel from "@/components/common/CartPanel";
import { toast } from "sonner";

type MenuCategory = "Coffee" | "Non Coffee" | "Pastries" | "Snacks";

interface MenuSize {
  id: number;
  size: string;
  price: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  image: string;
  category: MenuCategory;
  sizes: MenuSize[];
}

interface CartItem {
  id: number;
  menuId: number;
  sizeId: number;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

const mockMenu = [
  {
    id: 1,
    name: "Espresso",
    description: "Rich and bold single shot",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400",
    category: "Coffee",
    sizes: [
      { id: 1, size: "Small", price: 2.5 },
      { id: 2, size: "Medium", price: 3.5 },
      { id: 3, size: "Large", price: 4.5 },
    ],
  },
  {
    id: 2,
    name: "Cappuccino",
    description: "Espresso with steamed milk foam",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
    category: "Coffee",
    sizes: [
      { id: 4, size: "Small", price: 3.5 },
      { id: 5, size: "Medium", price: 4.5 },
      { id: 6, size: "Large", price: 5.5 },
    ],
  },
  {
    id: 3,
    name: "Latte",
    description: "Smooth espresso with steamed milk",
    image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400",
    category: "Coffee",
    sizes: [
      { id: 7, size: "Small", price: 3.8 },
      { id: 8, size: "Medium", price: 4.8 },
      { id: 9, size: "Large", price: 5.8 },
    ],
  },
  {
    id: 4,
    name: "Americano",
    description: "Espresso with hot water",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400",
    category: "Coffee",
    sizes: [
      { id: 10, size: "Small", price: 2.8 },
      { id: 11, size: "Medium", price: 3.8 },
      { id: 12, size: "Large", price: 4.8 },
    ],
  },
  {
    id: 5,
    name: "Mocha",
    description: "Chocolate and espresso blend",
    image: "https://images.unsplash.com/photo-1578374173705-7d1a0a3a82b3?w=400",
    category: "Coffee",
    sizes: [
      { id: 13, size: "Small", price: 4.0 },
      { id: 14, size: "Medium", price: 5.0 },
      { id: 15, size: "Large", price: 6.0 },
    ],
  },
  {
    id: 6,
    name: "Macchiato",
    description: "Espresso with a dollop of foam",
    image: "https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=400",
    category: "Coffee",
    sizes: [
      { id: 16, size: "Small", price: 3.2 },
      { id: 17, size: "Medium", price: 4.2 },
      { id: 18, size: "Large", price: 5.2 },
    ],
  },
  {
    id: 7,
    name: "Iced Matcha Latte",
    description: "Creamy matcha with milk served over ice",
    image: "https://images.unsplash.com/photo-1627998792088-f8016b438988?w=400",
    category: "Non Coffee",
    sizes: [
      { id: 19, size: "Small", price: 3.7 },
      { id: 20, size: "Medium", price: 4.7 },
      { id: 21, size: "Large", price: 5.7 },
    ],
  },
  {
    id: 8,
    name: "Chocolate Croissant",
    description: "Buttery flaky croissant with chocolate filling",
    image: "https://images.unsplash.com/photo-1623334044303-241021148842?w=400",
    category: "Pastries",
    sizes: [
      { id: 22, size: "1 pc", price: 2.9 },
      { id: 23, size: "2 pcs", price: 5.4 },
      { id: 24, size: "4 pcs", price: 9.9 },
    ],
  },
  {
    id: 9,
    name: "Blueberry Muffin",
    description: "Soft muffin packed with blueberry bits",
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400",
    category: "Pastries",
    sizes: [
      { id: 25, size: "1 pc", price: 2.5 },
      { id: 26, size: "2 pcs", price: 4.6 },
      { id: 27, size: "4 pcs", price: 8.5 },
    ],
  },
  {
    id: 10,
    name: "Cheese Toasties",
    description: "Crispy toasted bread with melted cheese",
    image: "https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=400",
    category: "Snacks",
    sizes: [
      { id: 28, size: "Regular", price: 3.6 },
      { id: 29, size: "Double", price: 5.4 },
      { id: 30, size: "Share", price: 9.8 },
    ],
  },
  {
    id: 11,
    name: "Nacho Bites",
    description: "Crispy nachos with creamy cheese dip",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400",
    category: "Snacks",
    sizes: [
      { id: 31, size: "Regular", price: 3.9 },
      { id: 32, size: "Large", price: 5.9 },
      { id: 33, size: "Party", price: 10.5 },
    ],
  },
  {
    id: 12,
    name: "Strawberry Milkshake",
    description: "Refreshing milkshake with real strawberry bits",
    image: "https://images.unsplash.com/photo-1579954115563-e72bf1381629?w=400",
    category: "Non Coffee",
    sizes: [
      { id: 34, size: "Small", price: 3.4 },
      { id: 35, size: "Medium", price: 4.4 },
      { id: 36, size: "Large", price: 5.4 },
    ],
  },
] satisfies MenuItem[];

export default function Menu() {
  const categories: MenuCategory[] = [
    "Coffee",
    "Non Coffee",
    "Pastries",
    "Snacks",
  ];

  const [activeCategory, setActiveCategory] = useState<MenuCategory>("Coffee");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const filteredMenu = mockMenu.filter((item) => item.category === activeCategory);

  const handleAddToCart = (itemId: number, size: MenuSize) => {
    const menuItem = mockMenu.find((item) => item.id === itemId);
    if (!menuItem) return;

    const existingItem = cartItems.find(
      (item) => item.menuId === itemId && item.sizeId === size.id
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        menuId: itemId,
        sizeId: size.id,
        name: menuItem.name,
        size: size.size,
        price: size.price,
        quantity: 1,
        image: menuItem.image,
      };
      setCartItems([...cartItems, newItem]);
    }
    toast.success(`${menuItem.name} (${size.size}) added to cart`);
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
    } else {
      setCartItems(
        cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.info("Item removed from cart");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    toast.success("Order placed successfully!");
    setCartItems([]);
  };

  const handleToggleFavorite = (itemId: number) => {
    setFavorites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1">
        <h1 className="text-3xl text-[#5C5C5C] mb-6">Our Menu</h1>
        <div className="mb-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-xl px-5 py-2 text-sm transition-colors ${
                activeCategory === category
                  ? "bg-[#D4A156] text-white"
                  : "bg-white text-[#5C5C5C] hover:bg-[#F0E2CA]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMenu.map((item) => (
            <MenuCard
              key={item.id}
              {...item}
              isFavorite={favorites.includes(item.id)}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </div>

      <div className="w-96">
        <CartPanel
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemoveItem}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}
