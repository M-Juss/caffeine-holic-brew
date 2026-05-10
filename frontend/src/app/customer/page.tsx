"use client";

import { useState, useEffect, type ElementType } from "react";
import {
  Coffee,
  Heart,
  LogOut,
  ShoppingBag,
  User,
  Menu as MenuIcon,
  X,
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("customer_tab") as TabKey | null;
      if (
        tabParam &&
        (tabParam === "menu" ||
          tabParam === "orders" ||
          tabParam === "favorites" ||
          tabParam === "profile")
      ) {
        return tabParam;
      }
      return savedTab || "menu";
    }
    return tabParam || "menu";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("customer_tab", activeTab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", activeTab);
    window.history.replaceState({}, "", url.toString());
  }, [activeTab]);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    localStorage.removeItem("auth_token");
    localStorage.removeItem("authorization");
    localStorage.removeItem("customer_tab");
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
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen bg-[#2A231F] flex flex-col justify-between text-sm z-50 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } w-64 shrink-0`}
      >
        <div className="p-5 border-b border-[#3A322D] flex justify-between items-center">
          <Link href="/" className="font-bold text-[#F7F1E8] text-xl">
            ☕ Caffeine Holic Brew
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-[#F7F1E8]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setActiveTab(item.key);
                setSidebarOpen(false);
              }}
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
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-[#D8CCC0] hover:bg-[#3A322D] hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-[#2A231F] flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-[#F7F1E8]"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <span className="font-bold text-[#F7F1E8] text-lg">
            ☕ Caffeine Holic Brew
          </span>
        </div>

        {/* Content */}
        {activeTab === "menu" && <Menu />}
        {activeTab === "orders" && <MyOrders />}
        {activeTab === "favorites" && <Favorites />}
        {activeTab === "profile" && <Profile />}
      </main>
    </div>
  );
}
