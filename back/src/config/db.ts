import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI!);
    console.log("mongo connect: " + connect.connection.host);
  } catch (error) {
    console.error(error);
  }
};

export default connectDb;
