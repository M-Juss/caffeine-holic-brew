"use client";

import { useState, type ElementType } from "react";
import { Coffee, Heart, LogOut, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import MenuManagement from "@/layouts/admin/Menu";
import OrdersManagement from "@/layouts/admin/Order";
import Dashboard from "@/layouts/admin/Dashboard";

type TabKey = "dashboard" | "orders" | "menu";

export default function CustomerPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    localStorage.removeItem("auth_token");
    localStorage.removeItem("authorization");
    router.push("/login");
  };

  const navItems: { key: TabKey; icon: ElementType; label: string }[] = [
    { key: "dashboard", icon: Heart, label: "Dashboard" },
    { key: "menu", icon: Coffee, label: "Menu Management" },
    { key: "orders", icon: ShoppingBag, label: "Order Management" },
  ];

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#F5F5F5]">
      <aside className="w-70 shrink-0 h-screen bg-[#2A231F] flex flex-col justify-between text-sm sticky top-0">
        <div className="p-5 border-b border-[#3A322D]">
          <h1 className="font-bold text-[#F7F1E8] text-xl">
            ☕ Caffeine Holic Brew
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.key
                  ? "bg-[#D4A156] text-white"
                  : "text-[#D8CCC0] hover:bg-[#3A322D] hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#3A322D]">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#D8CCC0] hover:bg-[#3A322D] hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "menu" && <MenuManagement />}
        {activeTab === "orders" && <OrdersManagement />}
      </main>
    </div>
  );
}
