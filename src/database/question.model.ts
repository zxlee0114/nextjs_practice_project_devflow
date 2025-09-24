import {
  // Document,
  model,
  models,
  Schema,
  Types,
  HydratedDocument,
  Model,
} from "mongoose";

interface TQuestion {
  title: string;
  content: string;
  tags: Types.ObjectId[];
  views: number;
  upvotes: number;
  downvotes: number;
  answers: number;
  author: Types.ObjectId;
}

export type TQuestionDoc = HydratedDocument<TQuestion>;
// export interface TQuestionDoc extends TQuestion, Document {}

const QuestionSchema = new Schema<TQuestion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Question: Model<TQuestion> =
  models?.Question || model<TQuestion>("Question", QuestionSchema);

export default Question;
