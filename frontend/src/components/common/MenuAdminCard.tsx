import { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MenuCategory } from "@/types/app.types";

export interface MenuAdminCardSize {
  id: number;
  name: string;
  price: number;
}

export interface MenuAdminCardItem {
  id: number;
  name: string;
  description: string;
  image: string;
  category: MenuCategory;
  available: boolean;
  sizes: MenuAdminCardSize[];
}

interface MenuAdminCardProps {
  item: MenuAdminCardItem;
  isDeleting?: boolean;
  onEdit: (item: MenuAdminCardItem) => void;
  onDelete: (id: number) => void;
  onToggleAvailability: (id: number) => void;
}

function getApiOrigin(): string | null {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;

  try {
    return new URL(apiUrl).origin;
  } catch {
    return null;
  }
}

function toAbsoluteApiUrl(path: string): string {
  const origin = getApiOrigin();
  if (!origin) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

function buildImageCandidates(image: string): string[] {
  const raw = image.trim();
  if (!raw) return [];
  if (/^(https?:|blob:|data:)/i.test(raw)) return [raw];

  const normalized = raw.replace(/\\/g, "/").replace(/^\/+/, "");
  const strippedPublic = normalized.replace(/^public\//, "");

  const relativeCandidates = [
    `/${normalized}`,
    `/${strippedPublic}`,
    strippedPublic.startsWith("storage/") ? "" : `/storage/${strippedPublic}`,
  ].filter(Boolean);

  return Array.from(new Set(relativeCandidates.map(toAbsoluteApiUrl)));
}

export default function MenuAdminCard({
  item,
  isDeleting = false,
  onEdit,
  onDelete,
  onToggleAvailability,
}: MenuAdminCardProps) {
  const imageCandidates = useMemo(
    () => buildImageCandidates(item.image),
    [item.image],
  );
  const imageSrc = imageCandidates[0] ?? item.image;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <div className="flex gap-6">
        <img
          key={`${item.id}-${item.image}`}
          src={imageSrc}
          alt={item.name}
          className="w-32 h-32 object-cover rounded-xl"
          data-attempt="0"
          onError={(event) => {
            const target = event.currentTarget;
            const attempt = Number(target.dataset.attempt ?? "0");
            const nextAttempt = attempt + 1;
            if (nextAttempt >= imageCandidates.length) return;

            target.dataset.attempt = String(nextAttempt);
            target.src = imageCandidates[nextAttempt];
          }}
        />

        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl text-[#5C5C5C] mb-1">{item.name}</h3>
              <p className="text-xs text-[#D4A156] font-medium mb-1">
                {item.category}
              </p>
              <p className="text-[#A8A8A8] text-sm">{item.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-[#D4A156] border-[#D4A156]"
                onClick={() => onEdit(item)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive"
                disabled={isDeleting}
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-[#5C5C5C] mb-2">Available Sizes:</p>
            <div className="flex flex-wrap gap-3">
              {item.sizes.length > 0 ? (
                item.sizes.map((size) => (
                  <div
                    key={size.id}
                    className="px-4 py-2 bg-[#F5F5F5] rounded-lg text-sm text-[#5C5C5C]"
                  >
                    {size.name}: ₱ {size.price.toFixed(2)}
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#A8A8A8]">No variants added.</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleAvailability(item.id)}
              className={`px-4 py-1 rounded-full text-sm transition-all ${
                item.available
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {item.available ? "Available" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
