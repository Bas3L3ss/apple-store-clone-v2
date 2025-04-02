import { Upload, Trash2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
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
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Separator } from "@/src/components/ui/separator";
import { Switch } from "@/src/components/ui/switch";
import { FileUploader } from "../../ui/file-uploader";
import { Link } from "react-router";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/src/constants/images";
import useUserForm from "@/src/hooks/use-user-form";

export default function UserEditForm({
  initialData,
  pageTitle,
}: {
  initialData: any | null;
  pageTitle: string;
}) {
  const { form, isSubmitting, onSubmit, userRoleOptions } = useUserForm({
    initialData,
  });

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
        <CardDescription>
          Edit user information. Changes will be applied immediately after
          submission.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormDescription>Display name for the user</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Primary contact email</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userRoleOptions.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Determines user permissions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Verified Status */}
              <FormField
                control={form.control}
                name="verified"
                render={({ field }) => (
                  <FormLabel className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Verified</FormLabel>
                      <FormDescription>
                        User account verification status
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormLabel>
                )}
              />
            </div>

            <Separator />

            {/* Avatar */}
            <div>
              <FormLabel className="text-base">User Avatar</FormLabel>
              <FormDescription className="text-xs mb-2">
                Upload a profile picture (max 5MB)
              </FormDescription>

              <div className="space-y-4">
                {/* Current avatar preview - only shown if there's an avatar URL */}
                {typeof form.watch("avatar") === "string" &&
                  form.watch("avatar") && (
                    <div className="w-24 h-24 rounded-full overflow-hidden border border-input">
                      <img
                        src={form.watch("avatar")}
                        alt="Current avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                {/* File uploader for avatar image */}
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUploader
                          value={
                            field.value instanceof File ? [field.value] : []
                          }
                          onValueChange={(files) => {
                            // @ts-expect-error: no prob
                            field.onChange(files.length > 0 ? files?.[0] : "");
                          }}
                          maxFiles={1}
                          maxSize={MAX_FILE_SIZE}
                          accept={ACCEPTED_IMAGE_TYPES}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Avatar URL input - shown when avatar is a string */}
                {typeof form.watch("avatar") === "string" && (
                  <div className="flex gap-3">
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <div className="flex">
                              <div className="bg-muted p-2 flex items-center rounded-l-md border border-r-0 border-input">
                                <Upload className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Input
                                placeholder="https://example.com/avatar.jpg"
                                className="rounded-l-none"
                                value={
                                  typeof field.value === "string"
                                    ? field.value
                                    : ""
                                }
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => form.setValue("avatar", "")}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Account information display only */}
            {initialData && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Account Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">User ID:</div>
                  <div>{initialData._id}</div>

                  <div className="text-muted-foreground">Created:</div>
                  <div>{new Date(initialData.createdAt).toLocaleString()}</div>

                  <div className="text-muted-foreground">Last Updated:</div>
                  <div>{new Date(initialData.updatedAt).toLocaleString()}</div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Link to={"/dashboard/user"}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
