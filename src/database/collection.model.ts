import {
  HydratedDocument,
  Model,
  model,
  models,
  Schema,
  Types,
} from "mongoose";

export interface ICollection {
  author: Types.ObjectId;
  question: Types.ObjectId;
}

export type TCollectionDoc = HydratedDocument<ICollection>;

const CollectionSchema = new Schema<ICollection>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const Collection: Model<ICollection> =
  models?.Collection || model<ICollection>("Collection", CollectionSchema);

export default Collection;
