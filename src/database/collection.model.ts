import { model, models, Schema, Types } from "mongoose";

export type TCollection = {
  author: Types.ObjectId;
  question: Types.ObjectId;
};

const CollectionSchema = new Schema<TCollection>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const Collection =
  models?.Collection || model<TCollection>("Collection", CollectionSchema);

export default Collection;
