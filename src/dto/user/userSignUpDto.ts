import { IsDefined, IsEmail, Length } from 'class-validator';

export default class UserSignUpDto {
  @IsDefined()
  @Length(2, 50)
  @IsEmail()
  email!: string;

  @IsDefined()
  @Length(2, 50)
  name!: string;

  @IsDefined()
  @Length(2, 50)
  password!: string;
}
