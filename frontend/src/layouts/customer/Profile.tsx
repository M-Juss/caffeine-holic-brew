import { FormEvent, useEffect, useState } from "react";
import {
  CalendarClock,
  PhilippinePeso,
  LockKeyhole,
  ShoppingBag,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  changePassword,
  getProfile,
  type ProfileResponse,
  updateProfile,
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

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: "",
    phone_number: "",
    address: "",
    email: "",
  });

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
        setProfileForm({
          username: response.data.user.username ?? "",
          phone_number: response.data.user.phone_number ?? "",
          address: response.data.user.address ?? "",
          email: response.data.user.email,
        });
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

  const handleEditProfile = () => {
    if (!profile) return;

    setProfileForm({
      username: profile.user.username ?? "",
      phone_number: profile.user.phone_number ?? "",
      address: profile.user.address ?? "",
      email: profile.user.email ?? "",
    });
    setIsEditingProfile(true);
  };

  const handleCancelProfileEdit = () => {
    if (!profile) return;

    setProfileForm({
      username: profile.user.username ?? "",
      phone_number: profile.user.phone_number ?? "",
      address: profile.user.address ?? "",
      email: profile.user.email ?? "",
    });
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const username = profileForm.username.trim();
    const phoneNumber = profileForm.phone_number.trim();
    const address = profileForm.address.trim();
    const email = profileForm.email.trim();

    if (!username || !phoneNumber || !address) {
      toast.error("Username, phone number, and address are required.");
      return;
    }

    setIsSavingProfile(true);

    try {
      const response = await updateProfile({
        username,
        phone_number: phoneNumber,
        address,
        email,
      });

      setProfile((previousProfile) => {
        if (!previousProfile) return previousProfile;

        return {
          ...previousProfile,
          user: {
            ...previousProfile.user,
            username,
            phone_number: phoneNumber,
            address,
            email,
          },
        };
      });

      toast.success(response.message);
      setIsEditingProfile(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile.";
      toast.error(message);
    } finally {
      setIsSavingProfile(false);
    }
  };

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-white rounded-2xl shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <PhilippinePeso className="w-5 h-5 text-[#D4A156]" />
                <p className="text-md text-[#A8A8A8]">Total Spent</p>
              </div>
              <p className="text-[#5C5C5C] text-2xl font-medium">
                ₱ {Number(profile.stats.total_spent).toFixed(2)}
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="w-5 h-5 text-[#D4A156]" />
                <p className="text-md text-[#A8A8A8]">Total Orders</p>
              </div>
              <p className="text-[#5C5C5C] text-2xl font-medium">
                {profile.stats.total_orders}
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <CalendarClock className="w-5 h-5 text-[#D4A156]" />
                <p className="text-md text-[#A8A8A8]">Member Since</p>
              </div>
              <p className="text-[#5C5C5C] text-2xl font-medium">
                {formatDate(profile.stats.member_since)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            <div className="bg-white rounded-2xl p-8 shadow-md w-full">
              <div className="flex items-center gap-3 mb-5">
                <User className="w-5 h-5 text-[#D4A156]" />
                <h3 className="text-xl text-[#5C5C5C]">Account Information</h3>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                <div>
                  <p className="text-sm text-[#A8A8A8] mb-1">Username</p>
                  <Input
                    value={profileForm.username}
                    onChange={(event) =>
                      setProfileForm((previous) => ({
                        ...previous,
                        username: event.target.value,
                      }))
                    }
                    placeholder="Enter username"
                    disabled={!isEditingProfile || isSavingProfile}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#A8A8A8] mb-1">Phone Number</p>
                    <Input
                      value={profileForm.phone_number}
                      onChange={(event) =>
                        setProfileForm((previous) => ({
                          ...previous,
                          phone_number: event.target.value,
                        }))
                      }
                      placeholder="Enter phone number"
                      disabled={!isEditingProfile || isSavingProfile}
                    />
                  </div>

                  <div>
                    <p className="text-sm text-[#A8A8A8] mb-1">Email</p>
                    <Input
                      value={profileForm.email}
                      onChange={(event) =>
                        setProfileForm((previous) => ({
                          ...previous,
                          email: event.target.value,
                        }))
                      }
                      placeholder="Enter email"
                      disabled={!isEditingProfile || isSavingProfile}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#A8A8A8] mb-1">Address</p>
                  <Input
                    value={profileForm.address}
                    onChange={(event) =>
                      setProfileForm((previous) => ({
                        ...previous,
                        address: event.target.value,
                      }))
                    }
                    placeholder="Enter address"
                    disabled={!isEditingProfile || isSavingProfile}
                  />
                </div>

                {!isEditingProfile ? (
                  <Button
                    type="button"
                    onClick={handleEditProfile}
                    className="bg-[#D4A156] hover:bg-[#C59145] text-white"
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isSavingProfile}
                      className="bg-[#D4A156] hover:bg-[#C59145] text-white"
                    >
                      {isSavingProfile ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSavingProfile}
                      onClick={handleCancelProfileEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
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
