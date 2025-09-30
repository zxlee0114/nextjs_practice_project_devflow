import { HydratedDocument, Model, model, models, Schema } from "mongoose";

interface ITag {
  name: string;
  questionCount: number;
}

export type TTagDoc = HydratedDocument<ITag>;

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    questionCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Tag: Model<ITag> = models?.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
