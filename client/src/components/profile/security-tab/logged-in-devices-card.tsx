import useGetLoggedInDevices from "@/src/react-query-hooks/use-get-logged-in-devices";
import { CardContent } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";
import { AlertCircle, Monitor, Server } from "lucide-react";
import { deviceIcons, osIcons } from "@/src/constants/devices";
import { formatDate } from "@/src/lib/utils";

export const LoggedInDevicesCard = ({ userId }: { userId: string }) => {
  const { data, isError, isLoading } = useGetLoggedInDevices(userId);

  if (isLoading) {
    return (
      <CardContent className="!p-0">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg mt-2" />
      </CardContent>
    );
  }

  if (isError || !data?.devices) {
    return (
      <CardContent className="!p-0 flex items-center gap-2">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <span>Failed to fetch logged-in devices. Try again later.</span>
      </CardContent>
    );
  }

  return (
    <CardContent className=" space-y-4 p-0">
      {data.devices.map((device) => (
        <div
          key={device._id}
          className="flex items-center justify-between p-3 border rounded-lg shadow-sm bg-muted"
        >
          <div className="flex items-center gap-3">
            {deviceIcons[device.deviceMetadata.deviceType] ?? (
              <Monitor className="h-5 w-5 text-gray-500" />
            )}
            <div>
              <p className="font-medium">{device.deviceMetadata.name}</p>
              <p className="text-sm text-muted-foreground">
                {device.deviceMetadata.ip}
              </p>
              <p className="text-sm  ">{formatDate(device.loggedInAt)}</p>
            </div>
          </div>
          {osIcons[device.deviceMetadata.os] ?? (
            <Server className="h-5 w-5 text-gray-400" />
          )}
        </div>
      ))}
    </CardContent>
  );
};
