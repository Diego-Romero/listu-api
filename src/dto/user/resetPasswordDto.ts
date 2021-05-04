import { IsDefined, Length } from 'class-validator';

export default class ResetPasswordDto {
  @IsDefined()
  @Length(2, 50)
  password!: string;
}
