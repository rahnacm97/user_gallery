import OtpModel from "../models/Otp";
export class OtpRepository {
    async upsert(email, otp, purpose) {
        const result = await OtpModel.findOneAndUpdate({ email, purpose }, { otp, createdAt: new Date() }, { upsert: true, returnDocument: "after" });
        return result;
    }
    async findValid(email, otp, purpose) {
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        return await OtpModel.findOne({
            email,
            otp,
            purpose,
            createdAt: { $gt: oneMinuteAgo },
        });
    }
    async findValidByOtp(otp, purpose) {
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
        return await OtpModel.findOne({
            otp,
            purpose,
            createdAt: { $gt: oneMinuteAgo },
        });
    }
    async deleteById(id) {
        const result = await OtpModel.deleteOne({ _id: id });
        return result.deletedCount > 0;
    }
}
