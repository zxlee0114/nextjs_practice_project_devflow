import { Document, model, models, Schema, Types } from "mongoose";

export type TAccount = {
  userId: Types.ObjectId;
  name: string;
  image?: string;
  password?: string;
  provider: string;
  providerAccountId: string;
};

export type TAccountDoc = TAccount & Document;

const AccountSchema = new Schema<TAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    image: { type: String },
    password: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
  },
  { timestamps: true }
);

const Account = models?.Account || model<TAccount>("Account", AccountSchema);
export default Account;
