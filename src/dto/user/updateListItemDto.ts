import { IsDefined, Length } from 'class-validator';

export default class UpdateListItemDto {
  @IsDefined()
  _id!: string;

  @IsDefined()
  @Length(2, 2000)
  name!: string;

  @IsDefined()
  done!: boolean;
}
