import { Document, model, models, Schema } from "mongoose";

export type TUser = {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
};

export type TUserDoc = TUser & Document;

const UserSchema = new Schema<TUser>(
  {
    name: { type: String, requered: true },
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

const User = models?.User || model<TUser>("User", UserSchema);
export default User;
