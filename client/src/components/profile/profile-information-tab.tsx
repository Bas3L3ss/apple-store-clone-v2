import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Calendar, CheckCircle, Mail, Shield, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { formatDate } from "@/src/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { TabsContent } from "../ui/tabs";
import { User as UserType } from "@/src/@types";
import {
  FormField,
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export const ProfileInformationTab = ({
  setIsEditMode,
  isEditMode,
  profileForm,
  loading,
  onProfileSubmit,
  user,
  submitting,
}: {
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  isEditMode: boolean;
  profileForm: UseFormReturn<
    {
      username: string;
      email: string;
    },
    any,
    undefined
  >;
  loading: boolean;
  user: UserType | null;
  submitting: boolean;
  onProfileSubmit: (data: { username: string; email: string }) => Promise<void>;
}) => {
  return (
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
          <CardDescription>Manage your personal information</CardDescription>
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
                        <Input placeholder="Your email address" {...field} />
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
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                </div>
                <p className="text-gray-900 pl-8">{user?.username}</p>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-1">
                  <Mail className="text-gray-400 h-5 w-5" />
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
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
  );
};
