import { Schema, model } from "mongoose";
import argon2 from "argon2";

export interface IUser {
    username?: string;
    password?: string;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, select: false }
});

userSchema.methods.comparePassword = async function (this: any, password: string): Promise<boolean> {
    if (!this.password) return false;
    return argon2.verify(this.password, password);
};

userSchema.pre("save", async function (this: any) {
    if (!this.isModified("password")) {
        return;
    }
    try {
        if (this.password) {
            this.password = await argon2.hash(this.password);
        }
    } catch (err: any) {
        throw err;
    }
});

export const User = model<IUser>("User", userSchema);


