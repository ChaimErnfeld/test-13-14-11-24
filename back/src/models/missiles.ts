import mongoose from "mongoose";

export interface IOrganization extends Document {
  name: string;
  description: string;
  speed: number;
  intercepts: string[];
  price: number;
}

const missileSchema = new mongoose.Schema<IOrganization>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  speed: { type: Number, required: true },
  intercepts: { type: [String], required: true },
  price: { type: Number, required: true },
});

export default mongoose.model<IOrganization>("Missile", missileSchema);
