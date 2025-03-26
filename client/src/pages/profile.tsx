import { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { passwordFormSchema, profileFormSchema } from "../schemas";
import { useAuth } from "../contexts/AuthContext";
import {
  EditAccountPassword,
  editUserProfile,
  sendVerificationEmail,
} from "../action/auth";
import { Navigate } from "react-router";
import { toast } from "sonner";

import LoadingState from "../components/loading";
import SEO from "../components/SEO";
import { ProfileAvatar } from "../components/profile/profile-avatar";
import { UserVerificationCard } from "../components/profile/user-verfiication-card";
import { ProfileInformationTab } from "../components/profile/profile-information-tab";
import { SecurityTab } from "../components/profile/security-tab";

export default function ProfilePage() {
  const { account: user, isLoading: isAuthUserLoading } = useAuth();
  const [submitting, setIsSubmitting] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username ?? "",
      email: user?.email ?? "",
    },
  });

  const loading = submitting || isVerifying || isEditingAvatar;
  const passwordForm = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  if (!user) {
    return <Navigate to={"/"} />;
  }
  const onProfileSubmit = async (data: { username: string; email: string }) => {
    setIsSubmitting(true);
    try {
      await editUserProfile(data);

      toast.success("Edit profile successfully!");
    } catch (error) {
      // @ts-expect-error: no prob
      toast.error(error ?? "Please try again");
    }
    setIsSubmitting(false);
  };

  const onPasswordSubmit = async (data: {
    newPassword: string;
    currentPassword: string;
  }) => {
    const { currentPassword, newPassword } = data;
    try {
      setIsSubmitting(true);

      await EditAccountPassword({ currentPassword, newPassword });
      toast.success("Password updated!");
    } catch (error) {
      console.log(error);

      // @ts-expect-error: no prob
      toast.error(error ?? "Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendVerificationEmail = async () => {
    try {
      setIsVerifying(true);
      await sendVerificationEmail();
      setVerificationSent(true);
    } catch (error) {
      console.error("Error sending verification email:", error);
      setVerificationSent(false);
    } finally {
      setIsVerifying(false);
    }
  };

  // Loading state
  if (isAuthUserLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <SEO
        title={`${user.username}'s Profile | Apple Store`}
        description="Edit your profile"
      />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Apple ID</h1>
          <p className="text-gray-500">
            Manage your Apple ID and account settings
          </p>
        </div>
        <ProfileAvatar
          isEditingAvatar={isEditingAvatar}
          loading={loading}
          setIsEditingAvatar={setIsEditingAvatar}
          user={user}
        />
        <UserVerificationCard
          handleSendVerificationEmail={handleSendVerificationEmail}
          isVerifying={isVerifying}
          loading={loading}
          user={user}
          verificationSent={verificationSent}
        />
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="text-sm">
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="security" className="text-sm">
              Security
            </TabsTrigger>
          </TabsList>
          <ProfileInformationTab
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            profileForm={profileForm}
            loading={loading}
            user={user}
            onProfileSubmit={onProfileSubmit}
            submitting={submitting}
          />
          <SecurityTab
            loading={loading}
            onPasswordSubmit={onPasswordSubmit}
            userId={user._id}
            passwordForm={passwordForm}
            submitting={submitting}
          />
        </Tabs>
      </div>
    </>
  );
}
