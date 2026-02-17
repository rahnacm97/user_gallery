import { IUser } from "../../interfaces/schema/IUser";
import { UserDTO } from "../../dtos/AuthDTO";

export interface IUserMapper {
  toDTO(user: IUser): UserDTO;
  toDTOList(users: IUser[]): UserDTO[];
}
