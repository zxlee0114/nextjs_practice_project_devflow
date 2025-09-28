import { HydratedDocument, Model, model, models, Schema } from "mongoose";

interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

export type TUserDoc = HydratedDocument<IUser>;
export type UserWithMeta = IUser & { _id: string; createdAt: Date };

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User: Model<IUser> = models?.User || model<IUser>("User", UserSchema);
export default User;
