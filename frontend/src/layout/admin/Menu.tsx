import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { Edit, Plus, Trash2, Upload } from "lucide-react";
import { InputWithLabel } from "@/components/common/InputWithLabel";
import { SelectWithLabel } from "@/components/common/SelectWithLabel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type MenuCategory = "Coffee" | "Non Coffee" | "Pastries" | "Snacks";

interface MenuSize {
  id: number;
  name: string;
  price: number;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  image: string;
  category: MenuCategory;
  basePrice: number;
  available: boolean;
  sizes: MenuSize[];
}

interface FormSize {
  id: string;
  name: string;
  price: string;
}

interface MenuFormState {
  name: string;
  description: string;
  image: string;
  category: MenuCategory;
  basePrice: string;
  availability: "available" | "unavailable";
  sizes: FormSize[];
}

const CATEGORY_OPTIONS = [
  { value: "Coffee", label: "Coffee" },
  { value: "Non Coffee", label: "Non Coffee" },
  { value: "Pastries", label: "Pastries" },
  { value: "Snacks", label: "Snacks" },
];

const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
];

const INITIAL_FORM: MenuFormState = {
  name: "",
  description: "",
  image: "",
  category: "Coffee",
  basePrice: "",
  availability: "available",
  sizes: [],
};

const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Espresso",
    description: "Rich and bold single shot",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400",
    category: "Coffee",
    basePrice: 3.5,
    available: true,
    sizes: [
      { id: 1, name: "Small", price: 2.5 },
      { id: 2, name: "Medium", price: 3.5 },
      { id: 3, name: "Large", price: 4.5 },
    ],
  },
  {
    id: 2,
    name: "Cappuccino",
    description: "Espresso with steamed milk foam",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
    category: "Coffee",
    basePrice: 4.5,
    available: true,
    sizes: [
      { id: 4, name: "Small", price: 3.5 },
      { id: 5, name: "Medium", price: 4.5 },
      { id: 6, name: "Large", price: 5.5 },
    ],
  },
  {
    id: 3,
    name: "Latte",
    description: "Smooth espresso with steamed milk",
    image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400",
    category: "Coffee",
    basePrice: 4.8,
    available: true,
    sizes: [
      { id: 7, name: "Small", price: 3.8 },
      { id: 8, name: "Medium", price: 4.8 },
      { id: 9, name: "Large", price: 5.8 },
    ],
  },
];

function newFormSize(): FormSize {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    price: "",
  };
}

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MenuFormState>(INITIAL_FORM);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setFormMode(null);
    setEditingId(null);
    setForm(INITIAL_FORM);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  const openAddForm = () => {
    setFormMode("add");
    setEditingId(null);
    setForm(INITIAL_FORM);
    setDialogOpen(true);
  };

  const openEditForm = (item: MenuItem) => {
    setFormMode("edit");
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      image: item.image,
      category: item.category,
      basePrice: item.basePrice.toString(),
      availability: item.available ? "available" : "unavailable",
      sizes: item.sizes.map((size) => ({
        id: size.id.toString(),
        name: size.name,
        price: size.price.toString(),
      })),
    });
    setDialogOpen(true);
  };

  const toggleAvailability = (id: number) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
    toast.success("Availability updated");
  };

  const deleteItem = (id: number) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
    toast.success("Item deleted");
  };

  const handleImagePick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, image: localUrl }));
  };

  const handleSizeFieldChange = (
    sizeId: string,
    field: "name" | "price",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.map((size) =>
        size.id === sizeId ? { ...size, [field]: value } : size
      ),
    }));
  };

  const handleAddSizeRow = () => {
    setForm((prev) => ({ ...prev, sizes: [...prev.sizes, newFormSize()] }));
  };

  const handleRemoveSizeRow = (sizeId: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((size) => size.id !== sizeId),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Please complete name and description.");
      return;
    }

    if (!form.image) {
      toast.error("Please select an image.");
      return;
    }

    const parsedBasePrice = Number(form.basePrice);
    if (Number.isNaN(parsedBasePrice) || parsedBasePrice <= 0) {
      toast.error("Please enter a valid price greater than 0.");
      return;
    }

    const hasInvalidSize = form.sizes.some((size) => {
      const parsed = Number(size.price);
      return !size.name.trim() || Number.isNaN(parsed) || parsed <= 0;
    });

    if (hasInvalidSize) {
      toast.error("Each size must have a name and a valid price.");
      return;
    }

    const maxSizeId = Math.max(
      0,
      ...menuItems.flatMap((item) => item.sizes.map((size) => size.id))
    );
    let nextSizeId = maxSizeId + 1;

    const normalizedSizes: MenuSize[] = form.sizes.map((size) => {
      const existingId = Number(size.id);
      const resolvedId =
        Number.isFinite(existingId) && existingId > 0 ? existingId : nextSizeId++;

      return {
        id: resolvedId,
        name: size.name.trim(),
        price: Number(size.price),
      };
    });

    if (formMode === "add") {
      const newId = Math.max(0, ...menuItems.map((item) => item.id)) + 1;
      const newItem: MenuItem = {
        id: newId,
        name: form.name.trim(),
        description: form.description.trim(),
        image: form.image,
        category: form.category,
        basePrice: parsedBasePrice,
        available: form.availability === "available",
        sizes: normalizedSizes,
      };

      setMenuItems((prev) => [...prev, newItem]);
      toast.success("Menu item added.");
      closeDialog();
      return;
    }

    if (formMode === "edit" && editingId) {
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name.trim(),
                description: form.description.trim(),
                image: form.image,
                category: form.category,
                basePrice: parsedBasePrice,
                available: form.availability === "available",
                sizes: normalizedSizes,
              }
            : item
        )
      );
      toast.success("Menu item updated.");
      closeDialog();
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl text-[#5C5C5C]">Menu Management</h1>
        <Button
          className="bg-[#D4A156] hover:bg-[#C59145] text-white"
          onClick={openAddForm}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Item
        </Button>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
            return;
          }
          setDialogOpen(true);
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {formMode === "edit" ? "Edit Menu Item" : "Add Menu Item"}
            </DialogTitle>
            <DialogDescription>
              Fill in the menu details, sizes, and availability.
            </DialogDescription>
          </DialogHeader>

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
              {form.image ? (
                <img
                  src={form.image}
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
                placeholder="Cappuccino"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />

              <SelectWithLabel
                id="menu-category"
                label="Category"
                placeholder="Select category"
                options={CATEGORY_OPTIONS}
                value={form.category}
                onValueChange={(value) =>
                  setForm({ ...form, category: value as MenuCategory })
                }
              />

              <InputWithLabel
                id="menu-price"
                label="Price"
                type="number"
                min="0"
                step="0.01"
                placeholder="4.50"
                value={form.basePrice}
                onChange={(event) =>
                  setForm({ ...form, basePrice: event.target.value })
                }
                required
              />

              <SelectWithLabel
                id="menu-availability"
                label="Availability"
                placeholder="Select availability"
                options={AVAILABILITY_OPTIONS}
                value={form.availability}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    availability: value as "available" | "unavailable",
                  })
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
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                required
              />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleAddSizeRow}
                className="text-md text-[#1A1A1A] underline underline-offset-4"
              >
                + Add Sizes / Variants
              </button>

              {form.sizes.map((size) => (
                <div
                  key={size.id}
                  className="rounded-xl bg-[#F6F6F6] p-4 space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <InputWithLabel
                      id={`size-name-${size.id}`}
                      label="Name"
                      placeholder="Large"
                      value={size.name}
                      onChange={(event) =>
                        handleSizeFieldChange(size.id, "name", event.target.value)
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
                        handleSizeFieldChange(size.id, "price", event.target.value)
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-destructive border-destructive"
                    onClick={() => handleRemoveSizeRow(size.id)}
                  >
                    Remove Size
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-[#D4A156] hover:bg-[#C59145] text-white">
                {formMode === "edit" ? "Update Menu" : "Save Menu"}
              </Button>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex gap-6">
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-xl"
              />

              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl text-[#5C5C5C] mb-1">{item.name}</h3>
                    <p className="text-xs text-[#D4A156] font-medium mb-1">{item.category}</p>
                    <p className="text-[#5C5C5C] text-sm mb-1">
                      Base Price: ${item.basePrice.toFixed(2)}
                    </p>
                    <p className="text-[#A8A8A8] text-sm">{item.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#D4A156] border-[#D4A156]"
                      onClick={() => openEditForm(item)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive"
                      onClick={() => deleteItem(item.id)}
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
                          {size.name}: ${size.price.toFixed(2)}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#A8A8A8]">No variants added.</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleAvailability(item.id)}
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
        ))}
      </div>
    </div>
  );
}
