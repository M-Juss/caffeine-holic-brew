import { useEffect, useState } from "react";
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
import { deleteMenu, getMenus } from "@/services/menu.api";
import { toast } from "sonner";

import type { MenuCategory } from "@/types/app.types";

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

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);
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

  const closeDialog = () => {
    setDialogOpen(false);
    setFormMode(null);
    setEditingItem(null);
  };

  const openAddForm = () => {
    setFormMode("add");
    setEditingItem(null);
    setDialogOpen(true);
  };

  const openEditForm = (item: MenuItem) => {
    setFormMode("edit");
    setEditingItem(item);
    setDialogOpen(true);
  };

  const toggleAvailability = (id: number) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item,
      ),
    );
    toast.success("Availability updated");
  };

  const deleteItem = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?",
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

  const handleFormSuccess = () => {
    closeDialog();
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
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-4">
        <h1 className="text-2xl lg:text-3xl text-[#5C5C5C]">Menu Management</h1>
        <Button
          className="bg-[#D4A156] p-3 lg:p-5 hover:bg-[#C59145] text-white text-xs lg:text-sm"
          onClick={openAddForm}
        >
          <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
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

          {formMode === "edit" && editingItem ? (
            <EditMenuForm
              menuId={editingItem.id}
              initialData={{
                name: editingItem.name,
                description: editingItem.description,
                category: editingItem.category,
                is_available: editingItem.available,
                sizes: editingItem.sizes.map((size) => ({
                  size: size.name,
                  price: size.price,
                })),
                image_path: editingItem.image,
              }}
              onSuccess={handleFormSuccess}
              onCancel={closeDialog}
            />
          ) : (
            <AddMenuForm onSuccess={handleFormSuccess} onCancel={closeDialog} />
          )}
        </DialogContent>
      </Dialog>

      {isLoadingMenus ? (
        <p className="text-xs lg:text-sm text-[#A8A8A8]">
          Loading menu items...
        </p>
      ) : (
        <div className="space-y-3 lg:space-y-4">
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
