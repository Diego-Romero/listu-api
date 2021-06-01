import { IsDefined, Length } from 'class-validator';

export default class UpdateListDto {
  @IsDefined()
  @Length(2, 2000)
  name!: string;

  @Length(0, 2000)
  description!: string;
}
