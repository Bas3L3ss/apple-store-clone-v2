import { FetchProductsResponse, User } from "@/src/@types";
import { axios, makeAxiosRequest } from "@/src/lib/utils";
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
    toast.error("Verification Failed", {
      description: "There was an issue processing your payment.",
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
    toast.error("Verification Failed", {
      description: "There was an issue processing your payment.",
    });
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
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("remember");

    const response = await axios.get("/auth/admin", {
      params: { search, type, isVerified, page, limit },
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
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("remember");

    const response = await axios.get(`/auth/admin/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return response.data;
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
