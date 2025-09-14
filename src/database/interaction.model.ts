import { model, models, Schema, Types } from "mongoose";

export type TInteraction = {
  user: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: "question" | "answer";
};

export const InteractionActionEnums = [
  "view",
  "upvote",
  "downvote",
  "bookmark",
  "post",
  "edit",
  "delete",
  "search",
] as const;

const InteractionSchema = new Schema<TInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: {
      type: String,
      enum: InteractionActionEnums,
      required: true,
    },
    actionId: { type: Schema.Types.ObjectId, required: true }, // 'questionId', 'answerId',
    actionType: { type: String, enum: ["question", "answer"], required: true },
  },
  { timestamps: true }
);

const Interaction =
  models?.Interaction || model<TInteraction>("Interaction", InteractionSchema);

export default Interaction;
