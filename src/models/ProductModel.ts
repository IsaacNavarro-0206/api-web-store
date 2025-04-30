import { Document, model, Schema, Types } from "mongoose";
import { ICategory } from "./CategoryModel";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  brand?: string;
  stock: number;
  category?: Types.ObjectId | ICategory;
  rating: number;
  createdAt: Date;
  images: string[];
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: String },
  stock: { type: Number, default: 0 },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  images: [{ type: String }],
});

export const Product = model<IProduct>("Product", productSchema);
