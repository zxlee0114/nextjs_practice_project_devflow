import { model, models, Schema, Types } from "mongoose";

export type TTagQuestion = {
  tag: Types.ObjectId;
  question: Types.ObjectId;
};

const TagQuestionSchema = new Schema<TTagQuestion>(
  {
    tag: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const TagQuestion =
  models?.TagQuestion || model<TTagQuestion>("TagQuestion", TagQuestionSchema);

export default TagQuestion;
