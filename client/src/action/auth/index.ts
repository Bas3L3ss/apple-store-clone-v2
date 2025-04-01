import { FetchProductsResponse, User } from "@/src/@types";
import { axios, getDeviceInfo, makeAxiosRequest } from "@/src/lib/utils";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export const editUserProfile = async (data: {
  avatar?: string;
  username: string;
  email: string;
}) => {
  try {
    const response = await makeAxiosRequest("put", `/auth/account`, data);

    return response;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};

export async function sendVerificationEmail() {
  try {
    await makeAxiosRequest<{ url: string }>("post", "/auth/verify");
    toast.success("Verification Email Sent!", {
      description: "Please check your inbox to verify your email.",
    });
  } catch (err) {
    console.error("Error:", err);
    toast.error("Email sending Failed", {
      description: "There was an issue sending email.",
    });
  }
}
export async function editUserAvatar(avatar?: File | string) {
  if (!avatar) throw new Error("Please retry");
  const formData = new FormData();
  formData.append("avatar", avatar);
  try {
    await makeAxiosRequest<{ url: string }>(
      "put",
      "/auth/account/avatar",
      formData,
      true
    );
    toast.success("Your avatar has been edited!", {
      description: "Please refresh to see your new avatar.",
    });
  } catch (err) {
    console.error("Error:", err);
    // @ts-expect-error: no prob
    toast.error(err ?? "Please try again");
  }
}

export async function sendResetPasswordEmail(email: string) {
  try {
    await axios.post("/auth/send-reset-link", { email });

    toast.success("Reset password request sent!", {
      description:
        "Check your inbox and follow the instructions to reset your password.",
    });
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error("Reset request failed", {
        description: "Please fill in valid email",
      });
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    throw error;
  }
}

export async function resetPassword(password: string, token?: string | null) {
  if (!token) {
    throw new Error("No token is found");
  }
  try {
    await axios.post(
      "/auth/reset-password",
      {
        password,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Reset password sucess!", {
      description: "Proceeding to login page...",
    });
  } catch (error) {
    console.log(error);

    throw error;
  }
}

export const GetDashboardUsers = async ({
  search = "",
  type = "",
  isVerified = "None",
  page = "1",
  limit = "10",
}: {
  search?: string;
  type?: string;
  isVerified?: string;
  page?: string | number;
  limit?: string | number;
}): Promise<FetchProductsResponse> => {
  try {
    const token = sessionStorage.getItem("token");
    const deviceId = (await getDeviceInfo()).deviceId;

    const response = await axios.get("/auth/admin", {
      params: { search, type, isVerified, page, limit, deviceId },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return response.data;
  } catch (error) {
    console.log("Error fetching users: ", error);

    return {
      data: [],
      pagination: {
        currentPage: 0,
        limit: 0,
        total: 0,
        totalPages: 0,
      },
      success: false,
    };
  }
};

export const GetUserById = async ({
  userId,
}: {
  userId: string;
}): Promise<User[] | null> => {
  try {
    const response = await makeAxiosRequest<User[] | null>(
      "get",
      `/auth/admin/${userId}`
    );

    return response;
  } catch (error) {
    console.log("Error fetching users: ", error);

    return null;
  }
};
export const EditAccountAdmin = async ({
  newUserData,
  uid,
}: {
  newUserData: any;
  uid: string;
}) => {
  try {
    const formData = new FormData();

    for (const [key, val] of Object.entries(newUserData)) {
      // @ts-expect-error: no prob
      formData.append(key, val);
    }

    await makeAxiosRequest("put", `/auth/admin/${uid}`, formData, true);
  } catch (error) {
    console.error("Edit user Error:", error);
    toast.error("Edit user Failed", {
      description:
        "There was an issue creating user, ask maintainer about this issue or view the log.",
    });
    throw error;
  }
};

export const EditAccountPassword = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    await makeAxiosRequest("put", `/auth/account/password`, {
      currentPassword,
      newPassword,
    });
  } catch (error) {
    console.error("Edit user Error:", error);

    throw error;
  }
};

export const getLoggedInDevices = async () => {
  try {
    const res = await makeAxiosRequest<{
      success: boolean;
      devices: any[];
    }>("get", `/auth/account/devices`);
    return res;
  } catch (error) {
    console.log(error);
    // @ts-expect-error: no prob
    toast.error(error ?? "Something went wrong");

    throw error;
  }
};

export const deleteUsers = async (userIds: string[]) => {
  try {
    await makeAxiosRequest("delete", "/auth/account", { userIds });
    toast.success("Succesfully delete users");
  } catch (error) {
    // @ts-expect-error: no prob
    toast.error(error ?? "Something went wrong");

    throw error;
  }
};
