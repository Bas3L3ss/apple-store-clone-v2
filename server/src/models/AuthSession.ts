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
    loggedInAt: { type: Date, default: Date.now, expires: "30d" },
    deviceMetadata: {
      deviceType: String,
      os: String,
      ip: String,
      name: String,
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
