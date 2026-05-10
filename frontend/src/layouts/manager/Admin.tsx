"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddAdminForm } from "@/forms/AddAdminForm";
import { EditAdminForm } from "@/forms/EditAdminForm";
import { getAdmins, deleteAdmin, type Admin } from "@/services/admin.api";
import { toast } from "sonner";

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await getAdmins();
        setAdmins(response.data);
      } catch (error) {
        console.error("Failed to fetch admins:", error);
      }
    };
    fetchAdmins();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteAdmin(id);
      toast.success("Admin deleted successfully");
      setAdmins(admins.filter((a) => a.id !== id));
    } catch (error) {
      toast.error("Failed to delete admin");
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setIsEditDialogOpen(true);
  };

  const handleAddAdminSuccess = () => {
    setIsAddDialogOpen(false);
    getAdmins().then((response) => setAdmins(response.data));
  };

  const handleEditAdminSuccess = () => {
    setIsEditDialogOpen(false);
    getAdmins().then((response) => setAdmins(response.data));
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 lg:mb-7 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl text-[#5C5C5C]">Manage Admins</h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#D4A156] px-3 lg:px-4 py-2 hover:bg-[#C59145] text-white text-xs lg:text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Add New Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
            </DialogHeader>
            <AddAdminForm
              onSuccess={handleAddAdminSuccess}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Admin</DialogTitle>
            </DialogHeader>
            {editingAdmin && (
              <EditAdminForm
                admin={editingAdmin}
                onSuccess={handleEditAdminSuccess}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-100">
                {["Full Name", "Email", "Phone Number", "Status", "Action"].map(
                  (col) => (
                    <th
                      key={col}
                      className={`px-2 lg:px-3 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest ${col === "Action" ? "text-center" : "text-left"}`}
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, idx) => (
                <tr
                  key={admin.id}
                  className={`transition-colors hover:bg-gray-50 ${idx < admins.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <td className="px-2 lg:px-3 py-3">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <span className="font-semibold text-gray-800 text-xs lg:text-sm">
                        {admin.username}
                      </span>
                    </div>
                  </td>

                  <td className="px-2 lg:px-3 py-3">
                    <span className="text-gray-500 text-xs lg:text-sm">
                      {admin.email}
                    </span>
                  </td>

                  <td className="px-2 lg:px-3 py-3">
                    <span className="text-gray-700 text-xs lg:text-sm">
                      {admin.phone_number}
                    </span>
                  </td>

                  <td className="px-2 lg:px-3 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        admin.status.toLowerCase() === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {admin.status}
                    </span>
                  </td>

                  <td className="px-2 lg:px-3 py-3 text-center">
                    <div className="flex gap-1 lg:gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold px-2 lg:px-3 py-1.5 rounded-lg flex items-center gap-1 lg:gap-1.5 transition"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1.5 rounded-lg flex items-center transition"
                      >
                        <Trash className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
