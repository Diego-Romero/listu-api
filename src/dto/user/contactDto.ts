import { IsDefined, IsEmail, Length } from 'class-validator';

export default class ContactDto {
  @IsDefined()
  @Length(6, 50)
  @IsEmail()
  email!: string;

  @IsDefined()
  @Length(1, 5000)
  message!: string;
}
