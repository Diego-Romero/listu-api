import { IsDefined, IsEmail } from 'class-validator';

export default class InviteFriendDto {
  @IsDefined()
  @IsEmail()
  email!: string;
}
