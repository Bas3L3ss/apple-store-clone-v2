import { User } from "@/src/@types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

export const UserVerificationCard = ({
  user,
  verificationSent,
  handleSendVerificationEmail,
  loading,
  isVerifying,
}: {
  user: User | null;
  verificationSent: boolean;
  handleSendVerificationEmail: () => Promise<void>;
  loading: boolean;
  isVerifying: boolean;
}) => {
  return (
    !user?.verified && (
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
                Please check your inbox and follow the instructions to complete
                verification.
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
    )
  );
};
