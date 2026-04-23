import { User, Mail, Phone, MapPin } from "lucide-react";

export default function Profile() {
  return (
    <div className="p-6">
      <h1 className="text-3xl text-[#5C5C5C] mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl p-8 shadow-md w-full">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-[#D4A156] rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h2 className="text-2xl text-[#5C5C5C] mb-1">John Doe</h2>
            <p className="text-[#A8A8A8]">Customer since 2025</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-[#F5F5F5] rounded-xl">
            <Mail className="w-5 h-5 text-[#D4A156]" />
            <div>
              <p className="text-sm text-[#A8A8A8]">Email</p>
              <p className="text-[#5C5C5C]">john.doe@example.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-[#F5F5F5] rounded-xl">
            <Phone className="w-5 h-5 text-[#D4A156]" />
            <div>
              <p className="text-sm text-[#A8A8A8]">Phone</p>
              <p className="text-[#5C5C5C]">+1 (555) 123-4567</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-[#F5F5F5] rounded-xl">
            <MapPin className="w-5 h-5 text-[#D4A156]" />
            <div>
              <p className="text-sm text-[#A8A8A8]">Address</p>
              <p className="text-[#5C5C5C]">123 Coffee Street, Brew City, BC 12345</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
