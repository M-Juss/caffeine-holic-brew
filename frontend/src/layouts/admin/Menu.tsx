import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddMenuForm } from "@/forms/AddMenuForm";
import { EditMenuForm } from "@/forms/EditMenuForm";
import MenuAdminCard from "@/components/common/MenuAdminCard";
import { createMenu, deleteMenu, getMenus, updateMenu } from "@/services/menu.api";
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

function newFormSize(): FormSize {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    price: "",
  };
}

function createInitialForm(): MenuFormState {
  return {
    name: "",
    description: "",
    image: "",
    category: "Coffee",
    availability: "available",
    sizes: [newFormSize()],
  };
}

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MenuFormState>(createInitialForm());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        setIsLoadingMenus(true);
        const response = await getMenus();
        const menus: MenuItem[] = response.data.map((menu) => ({
          id: menu.id,
          name: menu.name,
          description: menu.description,
          image: resolveImageUrl(menu.image_path),
          category: menu.category,
          available: menu.is_available,
          sizes: menu.sizes.map((size, index) => ({
            id: index + 1,
            name: size.size,
            price: Number(size.price),
          })),
        }));
        setMenuItems(menus);
      } catch (error) {
        const err = error as Error;
        toast.error(err.message || "Failed to load menus.");
      } finally {
        setIsLoadingMenus(false);
      }
    };

    void loadMenus();
  }, []);

  const resetForm = () => {
    setFormMode(null);
    setEditingId(null);
    setForm(createInitialForm());
    setImageFile(null);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    resetForm();
  };

  const openAddForm = () => {
    setFormMode("add");
    setEditingId(null);
    setForm(createInitialForm());
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
      availability: item.available ? "available" : "unavailable",
      sizes:
        item.sizes.length > 0
          ? item.sizes.map((size) => ({
              id: size.id.toString(),
              name: size.name,
              price: size.price.toString(),
            }))
          : [newFormSize()],
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

  const deleteItem = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      const response = await deleteMenu(id);
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      toast.success(response.message || "Item deleted.");
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to delete menu item.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleImagePick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setImageFile(file);
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Please complete name and description.");
      return;
    }

    if (!form.image) {
      toast.error("Please select an image.");
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

    if (formMode === "edit" && editingId) {
      const confirmed = window.confirm(
        "Are you sure you want to update this menu item?"
      );
      if (!confirmed) return;

      try {
        setIsSaving(true);
        const response = await updateMenu(editingId, {
          image: imageFile ?? undefined,
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.category,
          is_available: form.availability === "available",
          sizes: normalizedSizes.map((size) => ({
            menu: size.name,
            price: size.price,
          })),
        });

        setMenuItems((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  name: response.data.name,
                  description: response.data.description,
                  image: resolveImageUrl(response.data.image_path || form.image),
                  category: response.data.category,
                  available: response.data.is_available,
                  sizes: response.data.sizes.map((size, index) => ({
                    id: normalizedSizes[index]?.id ?? index + 1,
                    name: size.size,
                    price: Number(size.price),
                  })),
                }
              : item
          )
        );
        toast.success(response.message || "Menu item updated.");
        closeDialog();
      } catch (error) {
        const err = error as Error;
        toast.error(err.message || "Failed to update menu.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAddMenuSave = async () => {
    if (!imageFile) {
      toast.error("Please select an image.");
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

    try {
      setIsSaving(true);
      const response = await createMenu({
        image: imageFile,
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        is_available: form.availability === "available",
        sizes: normalizedSizes.map((size) => ({
          name: size.name,
          price: size.price,
        })),
      });

      const newItem: MenuItem = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        image: resolveImageUrl(response.data.image_path),
        category: response.data.category,
        available: response.data.is_available,
        sizes: response.data.sizes.map((size, index) => ({
          id: maxSizeId + index + 1,
          name: size.size,
          price: Number(size.price),
        })),
      };

      setMenuItems((prev) => [...prev, newItem]);
      toast.success(response.message || "Menu item added.");
      closeDialog();
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to add menu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl text-[#5C5C5C]">Menu Management</h1>
        <Button
          className="bg-[#D4A156] p-5 hover:bg-[#C59145] text-white"
          onClick={openAddForm}
          disabled={isSaving}
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Menu
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

          {formMode === "edit" ? (
            <EditMenuForm
              form={form}
              categoryOptions={CATEGORY_OPTIONS}
              availabilityOptions={AVAILABILITY_OPTIONS}
              onSubmit={handleSubmit}
              onCancel={closeDialog}
              onImagePick={handleImagePick}
              onNameChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
              onCategoryChange={(value) =>
                setForm((prev) => ({ ...prev, category: value }))
              }
              onAvailabilityChange={(value) =>
                setForm((prev) => ({ ...prev, availability: value }))
              }
              onDescriptionChange={(value) =>
                setForm((prev) => ({ ...prev, description: value }))
              }
              onAddSize={handleAddSizeRow}
              onSizeFieldChange={handleSizeFieldChange}
              onRemoveSize={handleRemoveSizeRow}
            />
          ) : (
            <AddMenuForm
              form={form}
              categoryOptions={CATEGORY_OPTIONS}
              availabilityOptions={AVAILABILITY_OPTIONS}
              onSaveMenu={handleAddMenuSave}
              onCancel={closeDialog}
              onImagePick={handleImagePick}
              onNameChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
              onCategoryChange={(value) =>
                setForm((prev) => ({ ...prev, category: value }))
              }
              onAvailabilityChange={(value) =>
                setForm((prev) => ({ ...prev, availability: value }))
              }
              onDescriptionChange={(value) =>
                setForm((prev) => ({ ...prev, description: value }))
              }
              onAddSize={handleAddSizeRow}
              onSizeFieldChange={handleSizeFieldChange}
              onRemoveSize={handleRemoveSizeRow}
            />
          )}
        </DialogContent>
      </Dialog>

      {isLoadingMenus ? (
        <p className="text-sm text-[#A8A8A8]">Loading menu items...</p>
      ) : (
        <div className="space-y-4">
          {menuItems.map((item) => (
            <MenuAdminCard
              key={item.id}
              item={item}
              isDeleting={deletingId === item.id}
              onEdit={openEditForm}
              onDelete={deleteItem}
              onToggleAvailability={toggleAvailability}
            />
          ))}
        </div>
      )}
    </div>
  );
}
