import { Document, model, models, Schema } from "mongoose";

export type TTag = {
  name: string;
  questionCount: number;
};

export type TTagDoc = TTag & Document;

const TagSchema = new Schema<TTag>(
  {
    name: { type: String, required: true, unique: true },
    questionCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Tag = models?.Tag || model<TTag>("Tag", TagSchema);

export default Tag;
