import mongoose, { Schema } from "mongoose";
const OtpSchema = new Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    purpose: {
        type: String,
        enum: ["signup", "forgot-password"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: "1m" },
    },
});
export default mongoose.model("Otp", OtpSchema);
