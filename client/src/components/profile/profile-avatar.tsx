import { User } from "@/src/@types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { editUserAvatar } from "@/src/action/auth";
import { useState } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import { AlertCircle, CheckCircle, Shield } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { FileUploader } from "../ui/file-uploader";
import { MAX_FILE_SIZE } from "@/src/constants";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDate } from "@/src/lib/utils";
import { Link } from "react-router";

export const ProfileAvatar = ({
  setIsEditingAvatar,
  user,
  loading,
  isEditingAvatar,
}: {
  setIsEditingAvatar: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  loading: boolean;
  isEditingAvatar: boolean;
}) => {
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [avatarInput, setAvatarInput] = useState<File[] | null | undefined>(
    null
  );
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
  return (
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
            <Link to={"/dashboard"}>
              <Badge className="bg-blue-600">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            </Link>
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
  );
};
