import { Schema, model } from "mongoose";
import argon2 from "argon2";
const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, select: false }
});
userSchema.methods.comparePassword = async function (password) {
    if (!this.password)
        return false;
    return argon2.verify(this.password, password);
};
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    try {
        if (this.password) {
            this.password = await argon2.hash(this.password);
        }
    }
    catch (err) {
        throw err;
    }
});
export const User = model("User", userSchema);
//# sourceMappingURL=user.model.js.map