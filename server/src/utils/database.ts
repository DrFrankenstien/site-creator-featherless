import { connect, disconnect } from "mongoose"

const db_URI = process.env.DB_URI || "mongodb://127.0.0.1:27017/siteCreator"

export const connectDB = async () => {
    await connect(db_URI)
}

export const disconnectDB = async (): Promise<void> => {
    await disconnect()
}