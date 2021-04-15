import { IsDefined, IsEmail, Length } from 'class-validator';

export default class UserLoginDto {
  @IsDefined()
  @IsEmail()
  email!: string;

  @IsDefined()
  @Length(6, 100)
  password!: string;
}
