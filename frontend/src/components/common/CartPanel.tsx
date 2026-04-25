import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface CartItem {
  id: number;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartPanelProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}

export default function CartPanel({ items, onUpdateQuantity, onRemove, onCheckout }: CartPanelProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="sticky top-6 bg-white rounded-2xl shadow-lg p-6 h-fit">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="w-6 h-6 text-[#D4A156]" />
        <h3 className="text-xl text-[#5C5C5C]">Your Cart</h3>
        <span className="ml-auto bg-[#D4A156] text-white px-3 py-1 rounded-full text-sm">
          {totalItems}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-[#A8A8A8] text-center py-8">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 pb-4 border-b border-[#E0E0E0]">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h4 className="text-[#5C5C5C] mb-1">{item.name}</h4>
                  <p className="text-sm text-[#A8A8A8] mb-2">{item.size}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-[#E0E0E0]"
                    >
                      <Minus className="w-3 h-3 text-[#5C5C5C]" />
                    </button>
                    <span className="text-[#5C5C5C] min-w-[20px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-[#F5F5F5] flex items-center justify-center hover:bg-[#E0E0E0]"
                    >
                      <Plus className="w-3 h-3 text-[#5C5C5C]" />
                    </button>
                    <button
                      onClick={() => onRemove(item.id)}
                      className=" ml-36 text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-[#D4A156]">₱ {item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#E0E0E0] pt-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-[#5C5C5C]">Total Items:</span>
              <span className="text-[#5C5C5C]">{totalItems}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-[#5C5C5C]">Total Amount:</span>
              <span className="text-[#D4A156]">₱ {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={onCheckout}
            className="w-full bg-[#D4A156] hover:bg-[#C59145] text-white rounded-xl py-6"
          >
            Checkout
          </Button>
        </>
      )}
    </div>
  );
}
