import User from "../models/User";
export class UserRepository {
    async create(item) {
        const user = new User(item);
        return await user.save();
    }
    async update(id, item) {
        return await User.findByIdAndUpdate(id, item, { new: true });
    }
    async delete(id) {
        const result = await User.findByIdAndDelete(id);
        return result !== null;
    }
    async find(item) {
        return await User.find(item).sort({
            createdAt: -1,
        });
    }
    async findOne(id) {
        return await User.findById(id);
    }
    async findByEmail(email) {
        return await User.findOne({ email });
    }
    async findByOTP(otp) {
        return await User.findOne({
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: new Date() },
        });
    }
}
