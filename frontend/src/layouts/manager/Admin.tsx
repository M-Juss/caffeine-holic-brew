"use client";

import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit } from "lucide-react";
import { useState } from "react";

const initialAdmins = [
  {
    id: 1,
    fullname: "Andrea Villanueva",
    email: "andrea.villanueva@tolsadmin.com",
    phone: "+63 912 345 6789",
    status: "Active",
  },
  {
    id: 2,
    fullname: "Jose Dela Cruz",
    email: "jose.delacruz@tolsadmin.com",
    phone: "+63 923 456 7890",
    status: "Active",
  },
  {
    id: 3,
    fullname: "Maria Santos",
    email: "maria.santos@tolsadmin.com",
    phone: "+63 934 567 8901",
    status: "Inactive",
  },
];

type Admin = (typeof initialAdmins)[0];

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);

  const handleDelete = (id: number) => {
    setAdmins(admins.filter((a) => a.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-3xl text-[#5C5C5C]">Manage Admins</h1>
        </div>
        <Button className="bg-[#D4A156] p-5 hover:bg-[#C59145] text-white">
          <Plus className="w-5 h-5 mr-2" />
          Add New Admin
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-100">
              {["Full Name", "Email", "Phone Number", "Status", "Action"].map((col) => (
                <th
                  key={col}
                  className={`px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest ${col === "Action" ? "text-center" : "text-left"}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, idx) => (
              <tr
                key={admin.id}
                className={`transition-colors hover:bg-gray-50 ${idx < admins.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <td className="px-5 py-4">
                  <span className="font-semibold text-gray-800 text-sm">{admin.fullname}</span>
                </td>

                <td className="px-5 py-4">
                  <span className="text-gray-500 text-sm">{admin.email}</span>
                </td>

                <td className="px-5 py-4">
                  <span className="text-gray-700 text-sm">{admin.phone}</span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      admin.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {admin.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition">
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <Trash className="w-4 h-4" /> Delete
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