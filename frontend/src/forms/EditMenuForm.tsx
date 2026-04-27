"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/common/InputWithLabel";
import { SelectWithLabel } from "@/components/common/SelectWithLabel";
import { updateMenu } from "@/services/menu.api";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import type { MenuCategory } from "@/types/app.types";

type EditMenuFormProps = {
  menuId: number;
  initialData: {
    name: string;
    description: string;
    category: MenuCategory;
    is_available: boolean;
    sizes: Array<{ size: string; price: number }>;
    image_path: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
};

const CATEGORY_OPTIONS = [
  { value: "Coffee", label: "Coffee" },
  { value: "Non Coffee", label: "Non Coffee" },
  { value: "Pastries", label: "Pastries" },
  { value: "Snacks", label: "Snacks" },
];

function resolveImageUrl(imagePath: string): string {
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return imagePath;
    const origin = new URL(apiUrl).origin;
    return `${origin}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
  } catch {
    return imagePath;
  }
}

export function EditMenuForm({
  menuId,
  initialData,
  onSuccess,
  onCancel,
}: EditMenuFormProps) {
  const [formData, setFormData] = useState({
    name: initialData.name,
    description: initialData.description,
    category: initialData.category,
    is_available: initialData.is_available,
    sizes: initialData.sizes.map((size, index) => ({
      id: index.toString(),
      name: size.size,
      price: size.price.toString(),
    })),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    resolveImageUrl(initialData.image_path),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAddSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        { id: Date.now().toString(), name: "", price: "" },
      ],
    }));
  };

  const handleRemoveSize = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size.id !== id),
    }));
  };

  const handleSizeChange = (
    id: string,
    field: "name" | "price",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((size) =>
        size.id === id ? { ...size, [field]: value } : size,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const hasInvalidSize = formData.sizes.some(
        (size) =>
          !size.name.trim() || !size.price || parseFloat(size.price) <= 0,
      );

      if (hasInvalidSize) {
        toast.error("Each size must have a name and a valid price");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        image: imageFile ?? undefined,
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        is_available: formData.is_available,
        sizes: formData.sizes.map((size) => ({
          menu: size.name.trim(),
          price: parseFloat(size.price),
        })),
      };

      await updateMenu(menuId, payload);
      toast.success("Menu item updated successfully");
      onSuccess();
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to update menu item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImagePick}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-44 rounded-xl border-2 border-dashed border-[#D4A156] bg-[#F9F4EC] hover:bg-[#F3E7D3] transition-colors flex items-center justify-center overflow-hidden"
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Menu preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-[#8E6A34]">
            <Upload className="w-7 h-7 mb-2" />
            <span className="text-sm">Click to select an image</span>
          </div>
        )}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputWithLabel
          id="menu-name"
          label="Name"
          placeholder="e.g Iced Coffee"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
          containerClassName="md:col-span-2"
        />

        <SelectWithLabel
          id="menu-category"
          label="Category"
          placeholder="Select category"
          options={CATEGORY_OPTIONS}
          value={formData.category}
          onValueChange={(value: string) =>
            setFormData({ ...formData, category: value as MenuCategory })
          }
        />

        <SelectWithLabel
          id="menu-availability"
          label="Availability"
          placeholder="Select availability"
          options={[
            { value: "available", label: "Available" },
            { value: "unavailable", label: "Unavailable" },
          ]}
          value={formData.is_available ? "available" : "unavailable"}
          onValueChange={(value: string) =>
            setFormData({
              ...formData,
              is_available: value === "available",
            })
          }
        />
      </div>

      <div>
        <label htmlFor="menu-description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="menu-description"
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring mt-2"
          placeholder="Write a short description"
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleAddSize}
          className="text-md text-[#1A1A1A] underline underline-offset-4"
        >
          + Add Sizes / Variants
        </button>

        {formData.sizes.map((size) => (
          <div key={size.id} className="rounded-xl bg-[#F6F6F6] p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputWithLabel
                id={`size-name-${size.id}`}
                label="Name"
                placeholder="e.g Small"
                value={size.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSizeChange(size.id, "name", e.target.value)
                }
              />
              <InputWithLabel
                id={`size-price-${size.id}`}
                label="Price"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g 300"
                value={size.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSizeChange(size.id, "price", e.target.value)
                }
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="text-destructive border-destructive"
              onClick={() => handleRemoveSize(size.id)}
            >
              Remove Size
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          className="bg-[#D4A156] hover:bg-[#C59145] text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Menu"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
