import { connect, disconnect } from "mongoose";
const db_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/siteCreator";
export const connectDB = async () => {
    try {
        await connect(db_URI);
        console.log("Connected to MongoDB successfully");
    }
    catch (err) {
        console.warn("MongoDB connection warning:", err.message || err);
    }
};
export const disconnectDB = async () => {
    await disconnect();
};
//# sourceMappingURL=database.js.map