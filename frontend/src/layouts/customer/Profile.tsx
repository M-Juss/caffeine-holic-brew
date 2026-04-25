import { FormEvent, useEffect, useState } from "react";
import {
  CalendarClock,
  PhilippinePeso,
  LockKeyhole,
  Mail,
  ShoppingBag,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  changePassword,
  getProfile,
  type ProfileResponse,
} from "@/services/profile.api";
import { toast } from "sonner";

function formatDate(dateValue: string): string {
  return new Date(dateValue).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadProfile = async () => {
      await Promise.resolve();
      if (isCancelled) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await getProfile();
        if (isCancelled) return;
        setProfile(response.data);
      } catch (err) {
        if (isCancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load profile.";
        setError(message);
        toast.error(message);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isCancelled = true;
    };
  }, [refreshKey]);

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      toast.success(response.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to change password.";
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl text-[#5C5C5C] mb-6">My Profile</h1>

      {isLoading ? (
        <div className="bg-white rounded-2xl p-8 shadow-md text-[#A8A8A8]">
          Loading profile...
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl p-8 shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="bg-[#D4A156] hover:bg-[#C59145] text-white"
          >
            Retry
          </Button>
        </div>
      ) : !profile ? (
        <div className="bg-white rounded-2xl p-8 shadow-md text-[#A8A8A8]">
          Profile not found.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-md w-full">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-[#D4A156] rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl text-[#5C5C5C] mb-1">
                  {profile.user.username}
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-[#F5F5F5] rounded-xl">
                <Mail className="w-5 h-5 text-[#D4A156]" />
                <div>
                  <p className="text-sm text-[#A8A8A8]">Email</p>
                  <p className="text-[#5C5C5C]">{profile.user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-7">
            <div className="bg-white rounded-2xl p-8 shadow-md w-full space-y-3">
              <div className="flex items-center gap-3 mb-5">
                <ShoppingBag className="w-5 h-5 text-[#D4A156]" />
                <h3 className="text-xl text-[#5C5C5C]">Account Information</h3>
              </div>
              <div className="p-4 bg-[#F5F5F5] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarClock className="w-5 h-5 text-[#D4A156]" />
                  <p className="text-sm text-[#A8A8A8]">Member Since</p>
                </div>
                <p className="text-[#5C5C5C] font-medium">
                  {formatDate(profile.stats.member_since)}
                </p>
              </div>
              <div className="p-4 bg-[#F5F5F5] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <PhilippinePeso className="w-5 h-5 text-[#D4A156]" />
                  <p className="text-sm text-[#A8A8A8]">Total Spent</p>
                </div>
                <p className="text-[#5C5C5C] font-medium">
                  ₱ {Number(profile.stats.total_spent).toFixed(2)}
                </p>
              </div>

              <div className="p-4 bg-[#F5F5F5] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="w-5 h-5 text-[#D4A156]" />
                  <p className="text-sm text-[#A8A8A8]">Total Orders</p>
                </div>
                <p className="text-[#5C5C5C] font-medium">
                  {profile.stats.total_orders}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md w-full">
              <div className="flex items-center gap-3 mb-5">
                <LockKeyhole className="w-5 h-5 text-[#D4A156]" />
                <h3 className="text-xl text-[#5C5C5C]">Change Password</h3>
              </div>

              <form
                onSubmit={handleChangePassword}
                className="space-y-4 max-w-xl"
              >
                <div>
                  <p className="text-sm text-[#A8A8A8] mb-1">
                    Current Password
                  </p>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <p className="text-sm text-[#A8A8A8] mb-1">New Password</p>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <p className="text-sm text-[#A8A8A8] mb-1">
                    Confirm New Password
                  </p>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-[#D4A156] hover:bg-[#C59145] text-white"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
