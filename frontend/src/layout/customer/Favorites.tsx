export default function Favorites() {
  const mockFavorites = [
    {
      id: 1,
      name: "Cappuccino",
      image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
    },
    {
      id: 2,
      name: "Latte",
      image: "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400",
    },
    {
      id: 3,
      name: "Mocha",
      image: "https://images.unsplash.com/photo-1578374173705-7d1a0a3a82b3?w=400",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl text-[#5C5C5C] mb-6">My Favorites</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockFavorites.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
            <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-[#5C5C5C] text-center">{item.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
