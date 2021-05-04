import { IsDefined, IsEmail, Length } from 'class-validator';

export default class RegisterFriendDTO {
  @IsDefined()
  @Length(2, 50)
  name!: string;

  @IsDefined()
  @Length(2, 50)
  password!: string;
}
