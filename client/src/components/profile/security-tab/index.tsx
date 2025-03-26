import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { UseFormReturn } from "react-hook-form";
import { TabsContent } from "../../ui/tabs";
import {
  FormField,
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getDeviceInfo, makeAxiosRequest } from "@/src/lib/utils";
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
} from "../../ui/alert-dialog";
import { Separator } from "../../ui/separator";
import { LoggedInDevicesCard } from "./logged-in-devices-card";

export const SecurityTab = ({
  passwordForm,
  onPasswordSubmit,
  submitting,
  loading,
  userId,
}: {
  passwordForm: UseFormReturn<
    {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    any,
    undefined
  >;
  userId: string;

  onPasswordSubmit: (data: {
    newPassword: string;
    currentPassword: string;
  }) => Promise<void>;
  submitting: boolean;
  loading: boolean;
}) => {
  const [isLoggingOut, setIsLogginOut] = useState(false);
  const queryClient = useQueryClient();
  const handleLogOutAllDevices = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLogginOut(true);
    try {
      const deviceId = (await getDeviceInfo()).deviceId;
      await makeAxiosRequest("delete", "/auth/account/devices", {
        data: {
          deviceId,
        },
      });

      toast.success("All the devices have been logged out of this account!");
      queryClient.invalidateQueries({
        queryKey: ["user:loggedInDevices", userId],
      });
    } catch (error) {
      console.log(error);

      toast.error(error);
    } finally {
      setIsLogginOut(false);
    }
  };
  return (
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
                        uppercase, lowercase, numbers, and special characters.
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
            <h3 className="text-lg font-medium mb-4">Logged in devices</h3>

            <div className="space-y-4 space-x-4">
              <LoggedInDevicesCard userId={userId} />
            </div>
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
                      currently logged in. You'll need to sign in again on each
                      device.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogOutAllDevices}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut
                        ? "Logging out other devices..."
                        : "Sign Out of All Devices"}
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
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
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
  );
};
