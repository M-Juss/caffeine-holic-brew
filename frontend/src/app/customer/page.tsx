"use client";

import { useState, useEffect, type ElementType } from "react";
import { Coffee, Heart, LogOut, ShoppingBag, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Menu from "@/layouts/customer/Menu";
import Favorites from "@/layouts/customer/Favorites";
import MyOrders from "@/layouts/customer/MyOrder";
import Profile from "@/layouts/customer/Profile";
import Link from "next/link";

type TabKey = "menu" | "orders" | "favorites" | "profile";

export default function CustomerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TabKey | null;
  const [activeTab, setActiveTab] = useState<TabKey>("menu");

  useEffect(() => {
    if (
      tabParam &&
      (tabParam === "menu" ||
        tabParam === "orders" ||
        tabParam === "favorites" ||
        tabParam === "profile")
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    localStorage.removeItem("auth_token");
    localStorage.removeItem("authorization");
    router.push("/login");
  };

  const navItems: { key: TabKey; icon: ElementType; label: string }[] = [
    { key: "menu", icon: Coffee, label: "Menu / Order" },
    { key: "orders", icon: ShoppingBag, label: "My Orders" },
    { key: "favorites", icon: Heart, label: "Favorites" },
    { key: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#F5F5F5]">
      <aside className="w-70 shrink-0 h-screen bg-[#2A231F] flex flex-col justify-between text-sm sticky top-0">
        <div className="p-5 border-b border-[#3A322D]">
          <Link href="/" className="font-bold text-[#F7F1E8] text-xl">
            ☕ Caffeine Holic Brew
          </Link>
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
            className="flex w-full  items-center gap-3 px-4 py-3 rounded-lg text-[#D8CCC0] hover:bg-[#3A322D] hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        {activeTab === "menu" && <Menu />}
        {activeTab === "orders" && <MyOrders />}
        {activeTab === "favorites" && <Favorites />}
        {activeTab === "profile" && <Profile />}
      </main>
    </div>
  );
}
