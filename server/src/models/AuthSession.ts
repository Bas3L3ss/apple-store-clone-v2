import mongoose, { InferSchemaType, Model } from "mongoose";

const authSessionSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceId: { type: String, required: true, unique: true, index: true },
    loggedInAt: { type: Date, default: Date.now, index: { expires: "30d" } },
    deviceMetadata: {
      type: {
        deviceType: String,
        os: String,
        browser: String,
      },
      required: true,
    },
  },
  { timestamps: false }
);

type AuthSessionType = InferSchemaType<typeof authSessionSchema>;

const AuthSession: Model<AuthSessionType> = mongoose.model(
  "AuthSession",
  authSessionSchema
);
export { AuthSession, AuthSessionType };
