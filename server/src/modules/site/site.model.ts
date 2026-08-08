import { model, Schema } from "mongoose";
import { generateSecureHex } from "./site.service.js";

const siteSchema = new Schema({
    name: { type: String, required: true },
    phone: String,
    port: { type: Number, default: null },
    isDeployed: { type: Boolean, default: false },
    terminals: {
        type: [String],
        default: () => [generateSecureHex(16), generateSecureHex(16)],
    }
});

export const siteModel = model("Site", siteSchema);