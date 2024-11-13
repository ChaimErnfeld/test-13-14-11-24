import mongoose from "mongoose";

export interface IOrganization extends Document {
  name: string;
  resources: [
    {
      name: string;
      amount: number;
    }
  ];
  budget: number;
}

const organizationSchema = new mongoose.Schema<IOrganization>({
  name: { type: String, required: true },
  resources: {
    type: [
      {
        name: String,
        amount: Number,
      },
    ],
  },
  budget: { type: Number, required: true },
});

export default mongoose.model<IOrganization>("Organization", organizationSchema);
