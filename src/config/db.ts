import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI as string,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as mongoose.ConnectOptions
    );

    console.log("MongoDB conectado");
  } catch (error: any) {
    console.error("Error al conectar BD:", error.message);
    process.exit(1);
  }
};
