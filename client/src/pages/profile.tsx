import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import {
  User,
  Mail,
  Shield,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { passwordFormSchema, profileFormSchema } from "../schemas";
import { formatDate } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import {
  editUserAvatar,
  editUserProfile,
  sendVerificationEmail,
} from "../action/auth";
import { Navigate } from "react-router";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { FileUploader } from "../components/ui/file-uploader";
import { MAX_FILE_SIZE } from "../constants";
import LoadingState from "../components/loading";

export default function ProfilePage() {
  const { account: user, isLoading: isAuthUserLoading } = useAuth();
  const [submitting, setIsSubmitting] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarInput, setAvatarInput] = useState<File[] | null | undefined>(
    null
  );
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
      console.log(error);
      toast.error("Please try again");
    }
    setIsSubmitting(false);
  };

  const onPasswordSubmit = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    setIsSubmitting(true);

    // TODO: implement reset password
    console.log(data);
    setIsSubmitting(false);
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
  const handleEditAvatar = async () => {
    try {
      setIsEditingAvatar(true);

      await editUserAvatar(avatarInput?.[0]);
      setAvatarDialogOpen(false);
    } catch (error) {
      console.error("Error sending verification email:", error);
    } finally {
      setIsEditingAvatar(false);
    }
  };

  // Loading state
  if (isAuthUserLoading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Apple ID</h1>
        <p className="text-gray-500">
          Manage your Apple ID and account settings
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative">
          <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
            <DialogTrigger asChild>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setAvatarDialogOpen(true)}
                      className="focus:outline-none"
                    >
                      <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
                        <AvatarImage
                          src={user?.avatar || "/api/placeholder/64/64"}
                          alt={user?.username}
                        />
                        <AvatarFallback>
                          {user?.username?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to edit your avatar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit avatar</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <FileUploader
                // @ts-expect-error: no prob
                value={avatarInput}
                // @ts-expect-error: no prob
                onValueChange={setAvatarInput}
                maxFiles={1}
                maxSize={MAX_FILE_SIZE}
                accept={{ "image/*": [] }}
              />
              <DialogFooter>
                <Button
                  disabled={loading || !avatarInput}
                  onClick={handleEditAvatar}
                >
                  {isEditingAvatar ? "Editing..." : "Edit avatar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {user?.role == "admin" && (
            <div className="absolute -bottom-2 -right-2">
              <Badge className="bg-blue-600">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            </div>
          )}
        </div>

        <div className="text-center md:text-left">
          <h2 className="text-2xl font-medium">{user?.username}</h2>
          <div className="flex flex-col md:flex-row md:items-center text-gray-500 space-y-1 md:space-y-0 md:space-x-2">
            <span>{user?.email}</span>
            {user?.verified ? (
              <Badge
                variant="outline"
                className="text-green-600 border-green-200 bg-green-50"
              >
                <CheckCircle className="h-3 w-3 mr-1" /> Verified
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-200 bg-amber-50"
              >
                <AlertCircle className="h-3 w-3 mr-1" /> Unverified
              </Badge>
            )}
          </div>
          <div className="text-gray-400 text-sm mt-1">
            Member since {formatDate(user!.createdAt)}
          </div>
        </div>
      </div>

      {!user?.verified && (
        <Card className="mb-8 border-amber-200">
          <CardHeader className="bg-amber-50">
            <CardTitle className="text-amber-800 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-amber-700">
              Please verify your email address to gain full access to all
              features.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {verificationSent ? (
              <div className="text-gray-700">
                <p className="mb-2">
                  A verification email has been sent to{" "}
                  <strong>{user?.email}</strong>.
                </p>
                <p>
                  Please check your inbox and follow the instructions to
                  complete verification.
                </p>
              </div>
            ) : (
              <>
                <p className="text-gray-700 mb-4">
                  We'll send a verification link to your email address{" "}
                  {user?.email}.
                </p>
                <Button
                  onClick={handleSendVerificationEmail}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isVerifying ? "Sending..." : "Send Verification Email"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="text-sm">
            Profile Information
          </TabsTrigger>
          <TabsTrigger value="security" className="text-sm">
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Profile Information</CardTitle>
                {!isEditMode && (
                  <Button variant="outline" onClick={() => setIsEditMode(true)}>
                    Edit
                  </Button>
                )}
              </div>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditMode ? (
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your email address"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Changing your email will require re-verification.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={loading}
                        onClick={() => setIsEditMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {submitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <User className="text-gray-400 h-5 w-5" />
                      <h3 className="text-sm font-medium text-gray-500">
                        Name
                      </h3>
                    </div>
                    <p className="text-gray-900 pl-8">{user?.username}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <Mail className="text-gray-400 h-5 w-5" />
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                    </div>
                    <p className="text-gray-900 pl-8">{user?.email}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <Calendar className="text-gray-400 h-5 w-5" />
                      <h3 className="text-sm font-medium text-gray-500">
                        Account Created
                      </h3>
                    </div>
                    <p className="text-gray-900 pl-8">
                      {formatDate(user!.createdAt)}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <Calendar className="text-gray-400 h-5 w-5" />
                      <h3 className="text-sm font-medium text-gray-500">
                        Last Updated
                      </h3>
                    </div>
                    <p className="text-gray-900 pl-8">
                      {formatDate(user!.updatedAt)}
                    </p>
                  </div>

                  {user!.role == "admin" && (
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <Shield className="text-gray-400 h-5 w-5" />
                        <h3 className="text-sm font-medium text-gray-500">
                          Admin Status
                        </h3>
                      </div>
                      <div className="pl-8">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-600 border-blue-200"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Administrator
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Your current password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Your new password"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Password must be at least 8 characters and include
                            uppercase, lowercase, numbers, and special
                            characters.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm your new password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {submitting ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </Form>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                <div className="space-y-4 space-x-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Sign Out of All Devices
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Sign Out of All Devices?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will sign you out from all devices where you're
                          currently logged in. You'll need to sign in again on
                          each device.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                          Sign Out of All Devices
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
