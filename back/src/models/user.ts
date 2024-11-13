import mongoose from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  organization: string;
  district: string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  organization: { type: String, required: true },
  district: { type: String, required: true },
});

export default mongoose.model<IUser>("User", userSchema);
