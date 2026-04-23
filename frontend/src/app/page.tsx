// page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className={`${menuOpen ? "overflow-hidden" : ""}`}>
      {/* OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"></div>
      )}

      {/* HEADER */}
      <header className="fixed w-full z-50 bg-[#808080]">
        <nav className="max-w-[1300px] mx-auto flex justify-between items-center p-5">
          <h2 className="text-white text-[1.5rem] md:text-[2rem] font-semibold">
            ☕ CAFFEINE HOLIC BREW.
          </h2>

          <ul
            className={`fixed md:static top-0 ${menuOpen ? "left-0" : "-left-[300px]"} w-[300px] md:w-auto h-full md:h-auto bg-white md:bg-transparent flex flex-col md:flex-row items-center pt-[100px] md:pt-0 gap-[10px] transition-all duration-200 z-50`}
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute right-[30px] top-[30px] text-xl md:hidden"
            >
              ✕
            </button>
            {[
              ["home", "Home"],
              ["about", "About"],
              ["menu", "Menu"],
              ["testimonials", "Testimonials"],
              ["gallery", "Gallery"],
              ["contact", "Contact"],
            ].map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setMenuOpen(false)}
                  className="px-[18px] py-[10px] rounded-[30px] text-[1.12rem] text-[#808080] md:text-white hover:bg-[#f3961c] hover:text-[#808080] transition"
                >
                  {label}
                </a>
              </li>
            ))}
            <Link href="/login" className=" bg-[#f3961c] px-5 py-3 rounded-full hover:bg-[#f3961c]/80">
            Login
          </Link>
          </ul>


          <button
            onClick={() => setMenuOpen(true)}
            className="text-white text-xl md:hidden"
          >
            ☰
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section id="home" className="min-h-screen bg-[#808080]">
        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row items-center justify-between px-5 pt-[20px] md:pt-[40px] min-h-screen">
          <div className="text-white">
            <h2
              className="text-[#f3961c] text-[1.8rem] md:text-[2.3rem]"
              style={{ fontFamily: "cursive" }}
            >
              Brewed to Brighten Your Day
            </h2>
            <h3 className="mt-2 text-[1.5rem] md:text-[2rem] font-semibold max-w-[70%]">
              Where Every Cup Tells a Story!
            </h3>
            <p className="mt-6 mb-10 max-w-[70%] text-[1.12rem]">
              Start your journey with a cup that speaks comfort, warmth, and
              happiness. Every sip is crafted to awaken your senses and fuel
              your passion for the day ahead.
            </p>
            <div className="flex gap-[23px]">
              <a className="px-[26px] py-[10px] bg-[#f3961c] text-[#808080] rounded-[30px] border-2 border-transparent hover:bg-transparent hover:text-white hover:border-white transition">
                Order Now
              </a>
              <a
                href="#contact"
                className="px-[26px] py-[10px] border-2 border-white text-white rounded-[30px] hover:bg-[#f3961c] hover:text-[#808080] hover:border-[#f3961c] transition"
              >
                Contact Us
              </a>
            </div>
          </div>
          <img src="/caffucino.png" className="max-w-[500px] mr-[30px]" />
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="py-[80px] md:py-[120px] bg-[#faf4f5] text-black"
      >
        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row items-center justify-between gap-[50px] px-5">
          <img
            src="/hot-brewed-coffee.jpg"
            className="w-[400px] h-[400px] rounded-full object-cover"
          />
          <div className="max-w-[50%] text-center">
            <h2 className="text-[1.5rem] md:text-[2rem] uppercase">About Us</h2>
            <p className="mt-[50px] mb-[30px] leading-[30px] text-[1.12rem]">
              At Coffee House in Rosario Cavite, We believe coffee is more than
              just a drink it’s an experience, a connection, and a daily ritual
              that brings people closer. Our passion lies in crafting every cup
              with care, using quality beans and a touch of creativity to
              deliver flavors that comfort and inspire.
            </p>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section
        id="menu"
        className="py-[30px] md:py-[50px] pb-[50px] md:pb-[100px] bg-[#808080] text-white"
      >
        <h2 className="text-center text-[1.5rem] md:text-[2rem] uppercase mb-[50px] md:mb-[100px]">
          Our Menu
        </h2>
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-5">
          {[
            [
              "/hot-brewed-coffee.jpg",
              "Hot Beverages",
              "Wide range of Steaming hot coffee to make you fresh and light.",
            ],
            [
              "/ice-chocolate-coffee.jpg",
              "Cold Beverages",
              "Creamy and frothy cold coffee to make you cool.",
            ],
            [
              "/fruit-juice.jpg",
              "Refreshment",
              "Fruit and icy refreshing drink to make feel refresh.",
            ],
            [
              "/pastry-coffee.jpg",
              "Special Combos",
              "Your favorite eating and drinking combations.",
            ],
            [
              "/chocolate-cake-slice.png",
              "Dessert",
              "Satiate your palate and take you on a culinary treat.",
            ],
            [
              "burger-frenchfries.jpg",
              "Burger & French Fries",
              "Quick bites to satisfy your small size hunger.",
            ],
          ].map(([img, name, desc], i) => (
            <div
              key={i}
              className="overflow-hidden rounded-[24px] bg-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src={img}
                className="w-full h-[260px] sm:h-[280px] md:h-[320px] object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="px-5 py-6 text-left text-white">
                <h3 className="text-[1.25rem] font-semibold">{name}</h3>
                <p className="mt-3 text-[1rem] leading-6">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        id="testimonials"
        className="py-[30px] md:py-[50px] pb-[50px] md:pb-[100px] bg-[#faf4f5] text-black"
      >
        <h2 className="text-center text-[1.5rem] md:text-[2rem] uppercase mb-[50px] md:mb-[100px]">
          Testimonials
        </h2>

        <div className="max-w-[1300px] mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 px-5">
          {[
            [
              "/user-1.jpg",
              "Raziel Mark Fernandez",
              '"Loved the French roast. Perfectly balanced and rich. Will order again!"',
            ],
            [
              "/user-2.jpg",
              "Jessica Gutierrez",
              '"Great espresso blend! Smooth and bold flavor. Fast shipping too!"',
            ],
            [
              "/user-3.jpg",
              "Joshua Garcia",
              '"Fantastic mocha flavor. Fresh and aromatic. Quick shipping!"',
            ],
            [
              "/user-4.jpg",
              "Kurt Railie Monton",
              '"Excellent quality! Fresh beans and quick delivery. Highly recommend."',
            ],
            [
              "/user-5.jpg",
              "Tristan",
              '"Best decaf I\'ve tried! Smooth and flavorful. Arrived promptly."',
            ],
          ].map(([img, name, feedback], i) => (
            <div
              key={i}
              className="rounded-[24px] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-8 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src={img}
                className="mx-auto w-[140px] h-[140px] rounded-full object-cover mb-[20px]"
              />
              <h3 className="text-[1.1rem] font-semibold mb-3">{name}</h3>
              <p className="text-[1rem] leading-7 text-[#444]">{feedback}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section
        id="gallery"
        className="py-[30px] md:py-[50px] pb-[50px] md:pb-[100px] bg-[#808080] text-white"
      >
        <h2 className="text-center text-[1.5rem] md:text-[2rem] uppercase mb-[50px] md:mb-[100px]">
          Gallery
        </h2>
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-5">
          {[
            "/breakfast-plate.jpg",
            "/ice-chocolate-coffee.jpg",
            "/cinnamon-coffee.png",
            "/egg-sausage-meal.jpg",
            "/fruit-juice.jpg",
            "/pancake-stack.jpg",
          ].map((img, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-[24px] bg-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src={img}
                className="w-full h-[260px] sm:h-[280px] md:h-[320px] object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="py-[30px] md:py-[50px] pb-[50px] md:pb-[100px] bg-[#faf4f5] text-black"
      >
        <h2 className="text-center text-[1.5rem] md:text-[2rem] uppercase mb-[50px] md:mb-[100px]">
          Contact Us
        </h2>
        <div className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[48px] px-5">
          <div className="space-y-[20px]">
            <p>📍 STI Building, General Trias Drive, Rosario Cavite</p>
            <p>📞 (+63)993-592-4903</p>
            <p>📧 chb-official@gmail.com</p>
            <p>🕒 Monday - Friday: 9:00 AM - 5:00 PM</p>
            <p>🕒 Saturday: 11:00 AM - 9:00 PM</p>
          </div>
          <form className=" w-full">
            <input
              className="w-full h-[50px] border mb-[16px] px-[12px]"
              placeholder="Your name"
            />
            <input
              className="w-full h-[50px] border mb-[16px] px-[12px]"
              placeholder="Your email"
            />
            <textarea
              className="w-full h-[100px] border mb-[16px] p-[12px]"
              placeholder="Your message"
            />
            <button className="px-[28px] py-[10px] bg-[#808080] text-white rounded-[30px] border hover:bg-transparent hover:text-[#808080] transition">
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#808080] text-white py-[10px] md:py-[20px]">
        <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row justify-between items-center px-5 gap-[20px]">
          <p>© 2026 Caffeine Holic Brew</p>
          <p>Privacy policy • Refund policy</p>
        </div>
      </footer>
    </main>
  );
}
