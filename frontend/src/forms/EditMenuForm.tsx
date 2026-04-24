import { type ChangeEvent, type FormEvent, useRef } from "react";
import { Upload } from "lucide-react";
import { InputWithLabel } from "@/components/common/InputWithLabel";
import { SelectWithLabel } from "@/components/common/SelectWithLabel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type MenuCategory = "Coffee" | "Non Coffee" | "Pastries" | "Snacks";

type FormSize = {
  id: string;
  name: string;
  price: string;
};

type MenuFormState = {
  name: string;
  description: string;
  image: string;
  category: MenuCategory;
  availability: "available" | "unavailable";
  sizes: FormSize[];
};

type EditMenuFormProps = {
  form: MenuFormState;
  categoryOptions: { value: string; label: string }[];
  availabilityOptions: { value: string; label: string }[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onImagePick: (event: ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: MenuCategory) => void;
  onAvailabilityChange: (value: "available" | "unavailable") => void;
  onDescriptionChange: (value: string) => void;
  onAddSize: () => void;
  onSizeFieldChange: (sizeId: string, field: "name" | "price", value: string) => void;
  onRemoveSize: (sizeId: string) => void;
};

export function EditMenuForm({
  form,
  categoryOptions,
  availabilityOptions,
  onSubmit,
  onCancel,
  onImagePick,
  onNameChange,
  onCategoryChange,
  onAvailabilityChange,
  onDescriptionChange,
  onAddSize,
  onSizeFieldChange,
  onRemoveSize,
}: EditMenuFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImagePick}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-44 rounded-xl border-2 border-dashed border-[#D4A156] bg-[#F9F4EC] hover:bg-[#F3E7D3] transition-colors flex items-center justify-center overflow-hidden"
      >
        {form.image ? (
          <img src={form.image} alt="Menu preview" className="h-full w-full object-cover" />
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
          placeholder="Cappuccino"
          value={form.name}
          onChange={(event) => onNameChange(event.target.value)}
          required
          containerClassName="md:col-span-2"
          className="h-10"
        />

        <SelectWithLabel
          id="menu-category"
          label="Category"
          placeholder="Select category"
          options={categoryOptions}
          value={form.category}
          onValueChange={(value) => onCategoryChange(value as MenuCategory)}
        />

        <SelectWithLabel
          id="menu-availability"
          label="Availability"
          placeholder="Select availability"
          options={availabilityOptions}
          value={form.availability}
          onValueChange={(value) =>
            onAvailabilityChange(value as "available" | "unavailable")
          }
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="menu-description">Description</Label>
        <textarea
          id="menu-description"
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Write a short description"
          value={form.description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          required
        />
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onAddSize}
          className="text-md text-[#1A1A1A] underline underline-offset-4"
        >
          + Add Sizes / Variants
        </button>

        {form.sizes.map((size) => (
          <div key={size.id} className="rounded-xl bg-[#F6F6F6] p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputWithLabel
                id={`size-name-${size.id}`}
                label="Name"
                placeholder="Large"
                value={size.name}
                onChange={(event) =>
                  onSizeFieldChange(size.id, "name", event.target.value)
                }
              />
              <InputWithLabel
                id={`size-price-${size.id}`}
                label="Price"
                type="number"
                min="0"
                step="0.01"
                placeholder="5.50"
                value={size.price}
                onChange={(event) =>
                  onSizeFieldChange(size.id, "price", event.target.value)
                }
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="text-destructive border-destructive"
              onClick={() => onRemoveSize(size.id)}
            >
              Remove Size
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="bg-[#D4A156] hover:bg-[#C59145] text-white">
          Update Menu
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
