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
import { AddRiderForm } from "@/forms/AddRiderForm";
import { EditRiderForm } from "@/forms/EditRiderForm";
import { getRiders, deleteRider, type Rider } from "@/services/rider.api";
import { toast } from "sonner";

export default function Rider() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRider, setEditingRider] = useState<Rider | null>(null);

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const response = await getRiders();
        setRiders(response.data);
      } catch (error) {
        console.error("Failed to fetch riders:", error);
      }
    };
    fetchRiders();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteRider(id);
      toast.success("Rider deleted successfully");
      setRiders(riders.filter((r) => r.id !== id));
    } catch (error) {
      toast.error("Failed to delete rider");
    }
  };

  const handleEdit = (rider: Rider) => {
    setEditingRider(rider);
    setIsEditDialogOpen(true);
  };

  const handleAddRiderSuccess = () => {
    setIsAddDialogOpen(false);
    getRiders().then((response) => setRiders(response.data));
  };

  const handleEditRiderSuccess = () => {
    setIsEditDialogOpen(false);
    getRiders().then((response) => setRiders(response.data));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-3xl text-[#5C5C5C]">Manage Riders</h1>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#D4A156] px-4 py-2 hover:bg-[#C59145] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add New Rider
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Rider</DialogTitle>
            </DialogHeader>
            <AddRiderForm
              onSuccess={handleAddRiderSuccess}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Rider</DialogTitle>
            </DialogHeader>
            {editingRider && (
              <EditRiderForm
                rider={editingRider}
                onSuccess={handleEditRiderSuccess}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-100">
              {["Full Name", "Email", "Phone Number", "Status", "Action"].map(
                (col) => (
                  <th
                    key={col}
                    className={`px-3 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest ${col === "Action" ? "text-center" : "text-left"}`}
                  >
                    {col}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {riders.map((rider, idx) => (
              <tr
                key={rider.id}
                className={`transition-colors hover:bg-gray-50 ${idx < riders.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800 text-sm">
                      {rider.username}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-3">
                  <span className="text-gray-500 text-sm">{rider.email}</span>
                </td>

                <td className="px-3 py-3">
                  <span className="text-gray-700 text-sm">
                    {rider.phone_number}
                  </span>
                </td>

                <td className="px-3 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      rider.status.toLowerCase() === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {rider.status}
                  </span>
                </td>

                <td className="px-3 py-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(rider)}
                      className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rider.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 gap-1 py-1.5 rounded-lg flex items-center transition"
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
  );
}
