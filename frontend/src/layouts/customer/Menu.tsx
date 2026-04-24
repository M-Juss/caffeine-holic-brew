import { useEffect, useMemo, useState } from "react";
import MenuCard from "@/components/common/MenuCard";
import CartPanel from "@/components/common/CartPanel";
import { toast } from "sonner";
import { getMenus } from "@/services/menu.api";
import { getFavorites, toggleFavorite } from "@/services/favorite.api";
import {
  addCartItem,
  checkoutCart,
  decreaseCartItem,
  getCart,
  increaseCartItem,
  removeCartItem,
  type CartResponseData,
} from "@/services/cart.api";

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
  available: boolean;
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

function resolveImageUrl(imagePath: string): string {
  if (!imagePath) return "";
  if (/^(https?:|blob:|data:)/i.test(imagePath)) return imagePath;

  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : imagePath.startsWith("storage/")
      ? `/${imagePath}`
      : `/storage/${imagePath}`;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return normalizedPath;
    const origin = new URL(apiUrl).origin;
    return `${origin}${normalizedPath}`;
  } catch {
    return normalizedPath;
  }
}

function mapCartItems(cart: CartResponseData | null): CartItem[] {
  if (!cart?.items?.length) return [];

  return cart.items.map((item) => ({
    id: item.id,
    menuId: item.menu_id,
    sizeId: item.id,
    name: item.name,
    size: item.size,
    price: Number(item.price),
    quantity: item.quantity,
    image: resolveImageUrl(item.image_path),
  }));
}

export default function Menu() {
  const categories: MenuCategory[] = [
    "Coffee",
    "Non Coffee",
    "Pastries",
    "Snacks",
  ];

  const [activeCategory, setActiveCategory] = useState<MenuCategory>("Coffee");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const filteredMenu = useMemo(
    () =>
      menuItems.filter(
        (item) =>
          item.available && item.category === activeCategory && item.sizes.length > 0
      ),
    [activeCategory, menuItems]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingMenus(true);
        const [menuResponse, favoriteResponse, cartResponse] = await Promise.all([
          getMenus(),
          getFavorites(),
          getCart(),
        ]);

        const menus: MenuItem[] = menuResponse.data.map((menu) => ({
          id: menu.id,
          name: menu.name,
          description: menu.description,
          image: resolveImageUrl(menu.image_path),
          category: menu.category,
          available: menu.is_available,
          sizes: menu.sizes.map((size, index) => ({
            id: menu.id * 1000 + index + 1,
            size: size.size,
            price: Number(size.price),
          })),
        }));

        const favoriteIds = favoriteResponse.data
          .map((favorite) => favorite.menu_id)
          .filter((menuId) => Number.isFinite(menuId));

        setMenuItems(menus);
        setFavorites(favoriteIds);
        setCartItems(mapCartItems(cartResponse.data));
      } catch (error) {
        const err = error as Error;
        toast.error(err.message || "Failed to load menu data.");
      } finally {
        setIsLoadingMenus(false);
      }
    };

    void loadData();
  }, []);

  const handleAddToCart = async (itemId: number, size: MenuSize) => {
    const menuItem = menuItems.find((item) => item.id === itemId);
    if (!menuItem) return;

    try {
      const response = await addCartItem({
        menu_id: itemId,
        size: size.size,
        quantity: 1,
      });
      setCartItems(mapCartItems(response.data));
      toast.success(`${menuItem.name} (${size.size}) added to cart`);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to add item to cart.");
    }
  };

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    const targetItem = cartItems.find((item) => item.id === id);
    if (!targetItem) return;

    if (quantity === 0) {
      await handleRemoveItem(id);
    } else {
      try {
        const response =
          quantity > targetItem.quantity
            ? await increaseCartItem(id)
            : await decreaseCartItem(id);

        setCartItems(mapCartItems(response.data));
      } catch (error) {
        const err = error as Error;
        toast.error(err.message || "Failed to update item quantity.");
      }
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      const response = await removeCartItem(id);
      setCartItems(mapCartItems(response.data));
      toast.info("Item removed from cart");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to remove item from cart.");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      const response = await checkoutCart();
      toast.success(response.message || "Order placed successfully.");
      setCartItems([]);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Checkout failed.");
    }
  };

  const handleToggleFavorite = async (itemId: number) => {
    const wasFavorite = favorites.includes(itemId);

    setFavorites((prev) =>
      wasFavorite ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );

    try {
      const response = await toggleFavorite({ menu_id: itemId });
      setFavorites((prev) =>
        response.is_favorited
          ? prev.includes(itemId)
            ? prev
            : [...prev, itemId]
          : prev.filter((id) => id !== itemId)
      );
      toast.success(response.message);
    } catch (error) {
      setFavorites((prev) =>
        wasFavorite ? [...prev, itemId] : prev.filter((id) => id !== itemId)
      );
      const err = error as Error;
      toast.error(err.message || "Failed to update favorite.");
    }
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
        {isLoadingMenus ? (
          <div className="text-[#A8A8A8] text-sm">Loading menu...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMenu.length > 0 ? (
              filteredMenu.map((item) => (
                <MenuCard
                  key={item.id}
                  {...item}
                  isFavorite={favorites.includes(item.id)}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            ) : (
              <div className="text-[#A8A8A8] text-sm">
                No available items in this category yet.
              </div>
            )}
          </div>
        )}
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
