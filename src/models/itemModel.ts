import { Document, model, Schema } from "mongoose";

export interface IItem extends Document {
  title: string;
  description: string;
  price: number;
  brand?: string;
  stock: number;
  category?: string;
  rating: number;
  createdAt: Date;
  images: string[];
}

const itemSchema = new Schema<IItem>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: String },
  stock: { type: Number, default: 0 },
  category: { type: String },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  images: [{ type: String }],
});

export const Item = model<IItem>("Item", itemSchema);
