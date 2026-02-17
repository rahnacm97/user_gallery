export class UserMapper {
    toDTO(user) {
        return {
            id: user._id.toString(),
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
        };
    }
    toDTOList(users) {
        return users.map((user) => this.toDTO(user));
    }
}
