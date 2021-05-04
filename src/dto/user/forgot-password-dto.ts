import { IsDefined, IsEmail, Length } from 'class-validator';

export default class ForgotPasswordDto {
  @IsDefined()
  @Length(2, 50)
  @IsEmail()
  email!: string;
}
