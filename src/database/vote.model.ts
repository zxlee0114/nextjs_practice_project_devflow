import {
  HydratedDocument,
  Model,
  model,
  models,
  Schema,
  Types,
} from "mongoose";

interface IVote {
  author: Types.ObjectId;
  actionId: Types.ObjectId;
  actionType: "question" | "answer";
  voteType: "upvote" | "downvote";
}

export type TVoteDoc = HydratedDocument<IVote>;

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, enum: ["question", "answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  { timestamps: true }
);

const Vote: Model<IVote> = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
