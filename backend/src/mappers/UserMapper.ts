import { IUser } from "../interfaces/schema/IUser";
import { UserDTO } from "../dtos/AuthDTO";
import { IUserMapper } from "../interfaces/mappers/IUserMapper";

export class UserMapper implements IUserMapper {
  toDTO(user: IUser): UserDTO {
    return {
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }

  toDTOList(users: IUser[]): UserDTO[] {
    return users.map((user) => this.toDTO(user));
  }
}
