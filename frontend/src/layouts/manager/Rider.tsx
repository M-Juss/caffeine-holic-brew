"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit } from "lucide-react";
import { useState } from "react";

const initialRiders = [
  {
    id: 1,
    fullname: "Miguel Santos",
    email: "miguel.santos@tolsbarber.com",
    phone: "+63 912 345 6789",
    status: "Active",
  },
  {
    id: 2,
    fullname: "Carlos Reyes",
    email: "carlos.reyes@tolsbarbers.com",
    phone: "+63 923 456 7890",
    status: "Active",
  },
  {
    id: 3,
    fullname: "Ramon Cruz",
    email: "ramon.cruz@tolsbarbersh.com",
    phone: "+63 934 567 8901",
    status: "Inactive",
  },
];

type Rider = (typeof initialRiders)[0];

const inputClassName =
  "border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none w-full focus:border-red-400 focus:ring-1 focus:ring-red-200 transition";

export default function Rider() {
  const [riders, setRiders] = useState<Rider[]>(initialRiders);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Rider | null>(null);

  const handleDelete = (id: number) => {
    setRiders(riders.filter((r) => r.id !== id));
  };

  const handleEdit = (rider: Rider) => {
    setEditingId(rider.id);
    setEditForm({ ...rider });
  };

  const handleSave = () => {
    if (!editForm) return;
    setRiders(riders.map((r) => (r.id === editingId ? { ...editForm } : r)));
    setEditingId(null);
    setEditForm(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-3xl text-[#5C5C5C]">Manage Riders</h1>
        </div>
        <Button className="bg-[#D4A156] p-5 hover:bg-[#C59145] text-white">
          <Plus className="w-5 h-5 mr-2" />
          Add New Rider
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-100">
              {["Full Name", "Email", "Phone Number", "Status", "Action"].map(
                (col) => (
                  <th
                    key={col}
                    className={`px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest ${col === "Action" ? "text-center" : "text-left"}`}
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
                className={`transition-colors ${editingId === rider.id ? "bg-red-50" : "hover:bg-gray-50"} ${idx < riders.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <td className="px-5 py-4">
                  {editingId === rider.id && editForm ? (
                    <input
                      value={editForm.fullname}
                      onChange={(e) =>
                        setEditForm({ ...editForm, fullname: e.target.value })
                      }
                      className={inputClassName}
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-800 text-sm">
                        {rider.fullname}
                      </span>
                    </div>
                  )}
                </td>

                <td className="px-5 py-4">
                  {editingId === rider.id && editForm ? (
                    <input
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className={inputClassName}
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">{rider.email}</span>
                  )}
                </td>

                <td className="px-5 py-4">
                  {editingId === rider.id && editForm ? (
                    <input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className={inputClassName}
                    />
                  ) : (
                    <span className="text-gray-700 text-sm">{rider.phone}</span>
                  )}
                </td>

                <td className="px-5 py-4">
                  {editingId === rider.id && editForm ? (
                    <select
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm({ ...editForm, status: e.target.value })
                      }
                      className={inputClassName}
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        rider.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {rider.status}
                    </span>
                  )}
                </td>

                <td className="px-5 py-4 text-center">
                  {editingId === rider.id ? (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleSave}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold px-4 py-2 rounded-lg border border-gray-200 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(rider)}
                        className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition"
                      >
                         <Edit/> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(rider.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-lg flex items-center transition"
                      >
                        <Trash/>Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
