import { model, models, Schema, Types } from "mongoose";

export type TModel = {};

const ModelSchema = new Schema<TModel>({}, { timestamps: true });

const Model = models?.Model || model<TModel>("Model", ModelSchema);

export default Model;
