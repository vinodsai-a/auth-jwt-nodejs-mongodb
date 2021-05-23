import { IsNotEmpty } from "class-validator";

export class UserDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  username: string;
}
