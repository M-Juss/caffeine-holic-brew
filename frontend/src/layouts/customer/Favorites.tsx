"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getFavorites } from "@/services/favorite.api";

interface FavoriteCard {
  id: number;
  name: string;
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

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        const response = await getFavorites();
        const mappedFavorites: FavoriteCard[] = response.data
          .filter((favorite) => Boolean(favorite.menu))
          .map((favorite) => ({
            id: favorite.menu.id,
            name: favorite.menu.name,
            image: resolveImageUrl(favorite.menu.image_path),
          }));
        setFavorites(mappedFavorites);
      } catch (error) {
        const err = error as Error;
        toast.error(err.message || "Failed to load favorites.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadFavorites();
  }, []);

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl lg:text-3xl text-[#5C5C5C] mb-4 lg:mb-6">
        My Favorites
      </h1>
      {isLoading ? (
        <p className="text-[#A8A8A8] text-sm">Loading favorites...</p>
      ) : favorites.length === 0 ? (
        <p className="text-[#A8A8A8] text-sm">No favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 sm:h-40 object-cover"
              />
              <div className="p-3 lg:p-4">
                <h3 className="text-[#5C5C5C] text-center text-sm lg:text-base">
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
