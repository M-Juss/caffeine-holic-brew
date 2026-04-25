import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";

interface MenuSize {
  id: number;
  size: string;
  price: number;
}

interface MenuCardProps {
  id: number;
  name: string;
  description: string;
  image: string;
  sizes: MenuSize[];
  isFavorite: boolean;
  onAddToCart: (itemId: number, size: MenuSize) => void;
  onToggleFavorite: (itemId: number) => void;
}

export default function MenuCard({
  id,
  name,
  description,
  image,
  sizes,
  isFavorite,
  onAddToCart,
  onToggleFavorite,
}: MenuCardProps) {
  const [selectedSize, setSelectedSize] = useState<MenuSize>(sizes[0]);

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      <div className="relative">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        <button
          onClick={() => onToggleFavorite(id)}
          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? "fill-[#D4A156] text-[#D4A156]" : "text-[#A8A8A8]"}`}
          />
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-xl text-[#5C5C5C] mb-2">{name}</h3>
        <p className="text-[#A8A8A8] text-sm mb-4 max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-16 group-hover:opacity-100">
          {description}
        </p>

        <div className="mb-4">
          <p className="text-sm text-[#5C5C5C] mb-2">Select Size:</p>
          <div className="grid grid-cols-3 gap-3">
            {sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
                  selectedSize.id === size.id
                    ? "bg-[#D4A156] text-white border-[#D4A156]"
                    : "bg-white text-[#5C5C5C] border-[#E0E0E0] hover:border-[#D4A156]"
                }`}
              >
                <div className="text-sm">{size.size}</div>
                <div className="text-xs">₱ {size.price.toFixed(2)}</div>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={() => onAddToCart(id, selectedSize)}
          className="w-full bg-[#D4A156] hover:bg-[#C59145] text-white rounded-xl"
        >
          Add to Cart - ₱ {selectedSize.price.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}
